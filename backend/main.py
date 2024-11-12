from fastapi import FastAPI, File, UploadFile
import shutil
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI()

MONGO_URI =
# MongoDB Configuration
client = AsyncIOMotorClient(MONGO_URI)
db = client.mydatabase
collection = db.files

UPLOAD_DIRECTORY = "./uploaded_files"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)

    # Save file to server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save file metadata to MongoDB
    file_metadata = {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_path": file_location
    }
    result = await collection.insert_one(file_metadata)

    return {"filename": file.filename, "status": "File saved successfully", "id": str(result.inserted_id)}
