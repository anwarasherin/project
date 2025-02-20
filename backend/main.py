from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from utils import save_to_disk, encrypt_aes256,load_public_key,load_private_key,read_encrypted_data_from_file,decrypt_dict, decrypt_aes256,compute_sha256, xor_hashes, generate_ecc_key_pair,encrypt_dict, save_encrypted_data_to_file, read_db, write_db
import os
import requests
import pickle
import uuid


import json
app = FastAPI()
os.makedirs("uploaded_files", exist_ok=True)

# generate_ecc_key_pair()

class FileRequest(BaseModel):
    data: str


@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    file_content = await file.read()
    file_content_hash = compute_sha256(file_content)

    file_base_name, file_extension = os.path.splitext(file.filename)
    fileId = uuid.uuid4()
    blockId = uuid.uuid4()

    response = requests.get("http://localhost:3000/latest_block")
    latest_block = response.json()['block']
    latest_block_hash = latest_block['hash']

    dynamic_aes_key = xor_hashes(file_content_hash,latest_block_hash)
    print("\nDynamic AES Key",dynamic_aes_key.hex())

    encryption_file_content = encrypt_aes256(dynamic_aes_key, file_content)
    print(f"\n\nEncrypted file content (in hex): {encryption_file_content.hex()}")

    save_to_disk(fileId+'.enc',encryption_file_content)

    response = requests.post("http://localhost:3000/add_block", json={"data":dynamic_aes_key.hex()},headers={
    "Content-Type": "application/json"
})
    new_block = response.json()["block"]

    ecc_public_key = load_public_key("ecc_keys/ecc_public_key.pem")
    encrypted_block = encrypt_dict(new_block,ecc_public_key)    
    save_encrypted_data_to_file(pickle.dumps(encrypted_block),blockId+'.enc')

    db = read_db("files")
    new_file_data_id = uuid.uuid4()
    new_file_data = {"id": new_file_data_id, "file_id":fileId, "block_id": blockId}
    db["files"].append(new_file_data)
    write_db(db)

    return {
        "message": "File saved successfully",
        "id": new_file_data_id ,
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
    
    encrypted_file_content =read_encrypted_data_from_file(filename+".enc")
    file_content = decrypt_aes256(bytes.fromhex(dynamic_aes_key),encrypted_file_content)
    print(file_content)
    return {"message": f"Received filename: "}

@app.get("/files")
def get_files():
    db = read_db()
    return db["files"]