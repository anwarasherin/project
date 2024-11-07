from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from utils import save_to_disk, encrypt_aes256, decrypt_aes256
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

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    key = os.urandom(32)  
    ciphertext = encrypt_aes256(key, content)
    print(f"Ciphertext (in hex): {ciphertext.hex()}")

    # decrypted_text = decrypt_aes256(key, ciphertext)
    # print(f"Decrypted text: {decrypted_text.decode()}")

    save_to_disk(file.filename,content)
        
    print("hello",content)
    return {
       "File saved successfully"
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'