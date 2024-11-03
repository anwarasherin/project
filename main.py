from fastapi import FastAPI, File, UploadFile
import os

app = FastAPI()
os.makedirs("uploaded_files", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to Dynamic AES Encryption with blockchain project"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    file_location = f"uploaded_files/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())  # Save the file
        
    print("hello",content)
    return {
       "File saved successfully"
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'