from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from utils import save_to_disk, encrypt_aes256, decrypt_aes256,compute_sha256, xor_hashes, generate_ecc_private_and_public_keys, encrypt_key_with_ecc
import os
import requests

app = FastAPI()
os.makedirs("uploaded_files", exist_ok=True)

# generate_ecc_private_and_public_keys()

class FileRequest(BaseModel):
    data: str


@app.get("/")
async def main():
    return HTMLResponse(
        content="""
        <h3>Upload File</h3>
        <form action="/upload-file/" enctype="multipart/form-data" method="post">
        <input name="file" type="file">
        <button type="submit">Upload</button>
        </form>
        <br/>

<h3>Retrieve File</h3>
<form id="retrieveForm">
  <label for="data">Enter a filename:</label>
  <input id="data" name="data" type="text" placeholder="Enter text here" required>
  <button type="submit">Retrieve</button>
</form>

<script>
  document.getElementById("retrieveForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const dataValue = document.getElementById("data").value;
    const jsonBody = { data: dataValue };

    try {
      const response = await fetch("/get-file/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  });
</script>
        """,
        status_code=200
    )

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    file_content = await file.read()
    file_content_hash = compute_sha256(file_content)

    file_base_name, file_extension = os.path.splitext(file.filename)

    response = requests.get("http://localhost:3000/latest_block")
    latest_block = response.json()['block']
    latest_block_hash = latest_block['hash']

    dynamic_aes_key = xor_hashes(file_content_hash,latest_block_hash)
    print("\nDynamic AES Key",dynamic_aes_key.hex())

    encryption_file_content = encrypt_aes256(dynamic_aes_key, file_content)
    print(f"\n\nEncrypted file content (in hex): {encryption_file_content.hex()}")

    save_to_disk(file_base_name+'.enc',encryption_file_content)

    response = requests.post("http://localhost:3000/add_block", json={"data":dynamic_aes_key.hex()},headers={
    "Content-Type": "application/json"
})
    new_block = response.json()["block"]

    encrypted_block = encrypt_key_with_ecc(block=new_block,pem_public_key="""-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEap+GJl8pg1JmbOf6EfJIz2p+Gtu1
ubkkcujCWtP/49lAncJenu8wgBe5Ii6q91o2wtufDTk2OKoiDg6SiJELQA==
-----END PUBLIC KEY-----""")
    
    print("Encrypted Block",encrypted_block.encode().hex())
    
    save_to_disk("encrypted_block"+'.enc',encrypted_block.encode())

    return {
        "message": "File saved successfully",
        "file_name": file.filename,
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'

@app.post("/get-file/")
async def get_file(request: FileRequest):
    filename = request.data
    print(filename)
    return {"message": f"Received filename: "}