from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from utils import save_to_disk, encrypt_aes256,load_public_key,load_private_key,read_encrypted_data_from_file,decrypt_dict, decrypt_aes256,compute_sha256, xor_hashes, generate_ecc_key_pair,encrypt_dict, save_encrypted_data_to_file
import os
import requests
import pickle

import json
app = FastAPI()
os.makedirs("uploaded_files", exist_ok=True)

# generate_ecc_key_pair()

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

    ecc_public_key = load_public_key("ecc_keys/ecc_public_key.pem")
    encrypted_block = encrypt_dict(new_block,ecc_public_key)    
    save_encrypted_data_to_file(pickle.dumps(encrypted_block),"encrypted_block.enc")

    return {
        "message": "File saved successfully",
        "file_name": file.filename,
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'

@app.post("/get-file/")
async def get_file(request: FileRequest):
    filename = request.data

    encrypted_block = read_encrypted_data_from_file("encrypted_block.enc")
    ecc_private_key = load_private_key("ecc_keys/ecc_private_key.pem")
    encrypted_block_dict =pickle.loads(encrypted_block)
    decrypted_block = decrypt_dict(encrypted_block_dict,ecc_private_key)

    dynamic_aes_key= decrypted_block["data"]
    
    encrypted_file_content =read_encrypted_data_from_file("main.enc")
    file_content = decrypt_aes256(bytes.fromhex(dynamic_aes_key),encrypted_file_content)
    print(file_content)
    return {"message": f"Received filename: "}