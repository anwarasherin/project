from fastapi import FastAPI, File, UploadFile
import os
from fastapi.responses import HTMLResponse

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

    file_location = f"uploaded_files/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())  # Save the file
        
    print("hello",content)
    return {
       "File saved successfully"
    }

# While uploading a file, Make sure the key is same as the function parameter, ie, 'file'