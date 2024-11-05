def save_to_disk(filename,content):
        file_location = f"uploaded_files/{filename}"
        with open(file_location, "wb") as f:
            f.write(content)