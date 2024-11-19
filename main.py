from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from utils import save_to_disk, encrypt_aes256, decrypt_aes256,compute_sha256
import os

app = FastAPI()
os.makedirs("uploaded_files", exist_ok=True)

@app.get("/")
async def main():
    return HTMLResponse(
        content="""
        <form action="/upload/" enctype="multipart/form-data" method="post">
        <input name="file" type="file">
        <button type="submit">Upload</button>
        </form>
        """,
        status_code=200
    )

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    save_to_disk(file.filename,content)
    hex_hash = compute_sha256(content)

    return {
        "message": "File saved successfully",
        "file_name": file.filename,
        "sha256_hash": hex_hash
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'

@app.post("/get-file/")
async def read_file_content(file: UploadFile = File(...)):
    content = await file.read()
    return {"filename": file.filename, "content_size": len(content),"content":content}