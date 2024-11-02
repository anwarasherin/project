from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Dynamic AES Encryption with blockchain project"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    print("hello",content)
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content)
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'