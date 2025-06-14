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

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['EMAILDB']
collection = db['signals']

# Load HTML template
with open("template.html", "r", encoding='utf-8') as f:
    template_html = Template(f.read())

@app.route("/upload_csv", methods=["POST"])
def upload_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "CSV file not provided"}), 400

    data = csv.DictReader(file.read().decode("utf-8").splitlines())
    inserted = []
    for row in data:
        inserted.append(collection.insert_one(row).inserted_id)

    return jsonify({"message": f"{len(inserted)} signals uploaded"}), 200

@app.route("/send_email", methods=["POST"])
def send_email():
    symbol = request.json.get("symbol")
    to_email = request.json.get("email")

    if not symbol or not to_email:
        return jsonify({"error": "Symbol and email are required"}), 400

    signal = collection.find_one({"symbol": symbol})
    if not signal:
        return jsonify({"error": "Symbol not found"}), 404

    signal["currentTime"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    html_content = template_html.render(**signal)

    # Compose email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Signal Alert: {signal['symbol']}"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    # Send email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, to_email, msg.as_string())
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
