from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from utils import save_to_disk, encrypt_aes256, decrypt_aes256,compute_sha256, xor_hashes
import os
import requests

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
    file_content = await file.read()
    file_content_hash = compute_sha256(file_content)

    response = requests.get("http://localhost:8000/latest_block")
    latest_block = response.json()['block']
    latest_block_hash = latest_block['hash']

    dynamic_aes_key = xor_hashes(file_content_hash,latest_block_hash)
    print("\nDynamic AES Key",dynamic_aes_key.hex())

    encryption_file_content = encrypt_aes256(dynamic_aes_key, file_content)
    print(f"\n\nEncrypted file content (in hex): {encryption_file_content.hex()}")

    return {
        "message": "File saved successfully",
        "file_name": file.filename,
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'

@app.post("/get-file/")
async def read_file_content(file: UploadFile = File(...)):
    content = await file.read()
    return {"filename": file.filename, "content_size": len(content),"content":content}