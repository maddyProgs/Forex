import os
import csv
import smtplib
from flask import Flask, request, jsonify
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from jinja2 import Template

# Load environment variables
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
MONGO_URI = os.getenv("MONGO_URI")

# Initialize app and database
app = Flask(__name__)
client = MongoClient(MONGO_URI)
db = client['EMAILDB']
collection = db['signals']

# Load templates
with open("single_signal_template.html", "r", encoding='utf-8') as f:
    signal_template = Template(f.read())
with open("email_wrapper.html", "r", encoding='utf-8') as f:
    wrapper_template = Template(f.read())

@app.route("/upload_csv", methods=["POST"])
def upload_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "CSV file not provided"}), 400
    data = csv.DictReader(file.read().decode("utf-8").splitlines())
    inserted = [collection.insert_one(row).inserted_id for row in data]
    return jsonify({"message": f"{len(inserted)} signals uploaded"}), 200

@app.route("/send_all_signals", methods=["POST"])
def send_all_signals():
    to_email = request.json.get("email")
    if not to_email:
        return jsonify({"error": "Recipient email is required"}), 400

    all_signals = collection.find()
    rendered_blocks = []

    for signal in all_signals:
        signal["currentTime"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        rendered_blocks.append(signal_template.render(**signal))

    full_html = wrapper_template.render(all_signals="\n".join(rendered_blocks))

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Daily Signal Digest"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg.attach(MIMEText(full_html, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, to_email, msg.as_string())
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
