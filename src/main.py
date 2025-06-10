# Main.py
from fastapi import FastAPI, UploadFile, File, HTTPException 
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import csv
import io
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from bson.json_util import dumps
from bson import ObjectId, json_util
from bson.errors import InvalidId
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000"
    ,
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
"""
# MongoDB configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "SIGNALSDB"
COLLECTION_NAME = "signals"

def get_db_connection(db_name: str):
    """Get database connection with case handling"""
    client = MongoClient(MONGO_URI)
    db_names = client.list_database_names()
    for existing_name in db_names:
        if existing_name.lower() == db_name.lower():
            return client[existing_name]
    return client[db_name]

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read and parse CSV
        contents = await file.read()
        csv_data = io.StringIO(contents.decode('utf-8'))
        csv_reader = csv.DictReader(csv_data)
        rows = list(csv_reader)
        
        if not rows:
            return JSONResponse(
                content={"message": "CSV file is empty"},
                status_code=400
            )
        
        # Connect to database
        db = get_db_connection(DB_NAME)
        collection = db[COLLECTION_NAME]
        
        # Add timestamp and insert into DB
        current_time = datetime.now()
        for row in rows:
            row['import_timestamp'] = current_time
        
        # Insert documents
        insert_result = collection.insert_many(rows)
        
        return JSONResponse(
            content={
                "message": "Data uploaded successfully",
                "database": db.name,
                "inserted_count": len(insert_result.inserted_ids)
            },
            status_code=200
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing CSV file: {str(e)}"
        )

@app.get("/get-signals/")
async def get_signals():
    """Endpoint to retrieve 2 signals"""
    try:
        db = get_db_connection(DB_NAME)
        collection = db[COLLECTION_NAME]
        
        # Use limit(2) to get only 2 records
        signals = dumps(list(collection.find({}).limit(12)))
        
        return JSONResponse(
            content={"signals": signals},
            status_code=200
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving signals: {str(e)}"
        )
    

@app.get("/get-signal/{signal_id}")
async def get_signal_by_id(signal_id: str):
    """Endpoint to retrieve a single signal by its MongoDB ObjectId"""
    try:
        # Convert string ID to MongoDB ObjectId
        obj_id = ObjectId(signal_id)
        
        db = get_db_connection(DB_NAME)
        collection = db[COLLECTION_NAME]
        
        # Find the document by _id
        signal = collection.find_one({"_id": obj_id})
        
        if not signal:
            raise HTTPException(
                status_code=404,
                detail="Signal not found"
            )
        
        # Convert to JSON and remove the _id field if needed
        signal_json = json_util.dumps(signal)
        
        return JSONResponse(
            content=signal_json,
            status_code=200
        )
        
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid signal ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving signal: {str(e)}"
        )
""" 
@app.get("/get-signals/")
async def get_signals():
    "Endpoint to retrieve all signals"
    try:
        db = get_db_connection(DB_NAME)
        collection = db[COLLECTION_NAME]
        signals = list(collection.find({}, {'_id': 0}))  # Exclude _id field from response
        
        return JSONResponse(
            content={
                "signals": signals
            },
            status_code=200
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving signals: {str(e)}"
        ) """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)