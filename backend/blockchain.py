from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
from utils import calculate_hash
import os
import json

DB_FILE = "blocks.json"


def read_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({"blocks":[]}, f)
    
    with open(DB_FILE, "r") as f:
        return json.load(f)


def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

    def __repr__(self):
        return f"Block(index={self.index}, hash={self.hash}, previous_hash={self.previous_hash})"

class Blockchain:
    def __init__(self):
        self.create_genesis_block()
        self.create_block_database()

    def create_genesis_block(self):
        db = read_db()
        blocks = db["blocks"]

        if len(blocks) > 0:
            return
        
        genesis_block = Block(
            0, "0", int(time.time()), "Genesis Block", 
            calculate_hash(Block(0, "0", int(time.time()), "Genesis Block", ""))
        )

        db = read_db()
        db["blocks"].append(genesis_block.__dict__)
        write_db(db)


    def create_block_database(self):
        if not os.path.exists(DB_FILE):
            with open(DB_FILE, "w") as f:
                json.dump({"blocks": []}, f)

    def add_block(self, data):
        db = read_db()
        blocks = db["blocks"]
        previous_block = blocks[-1]
        new_block = Block(
            len(blocks),
            previous_block["hash"],
            int(time.time()),
            data,
            calculate_hash(Block(len(blocks), previous_block["hash"], int(time.time()), data, ""))
        )
        db = read_db()
        print("New Block", new_block)
        db["blocks"].append(new_block.__dict__)
        write_db(db)

    def get_blocks(self):
        db = read_db()
        return db["blocks"]

    def is_chain_valid(self):
        db = read_db()
        chain = db["blocks"]
        write_db(db)
        for i in range(1, len(chain)):
            current_block = chain[i]
            previous_block = chain[i - 1]

            # Validate current block hash
            if current_block.hash != calculate_hash(current_block):
                return False

            # Validate previous hash
            if current_block.previous_hash != previous_block.hash:
                return False
        return True
    
    def get_latest_block(self):
        db = read_db()
        blocks = db["blocks"]
        return blocks[-1]


# FastAPI app setup
app = FastAPI()
blockchain = Blockchain()

# Request model for adding a block
class AddBlockRequest(BaseModel):
    data: str

# API Endpoints
@app.get("/")
def get_root():
    return {"message": "Welcome to the Blockchain Server!"}

@app.get("/blocks")
def get_blocks():
    return blockchain.get_blocks()

@app.post("/add_block")
def add_block(request: AddBlockRequest):
    blockchain.add_block(request.data)
    return {"message": "Block added successfully", "block": blockchain.get_latest_block()}

@app.get("/is_valid")
def is_valid():
    valid = blockchain.is_chain_valid()
    return {"is_valid": valid}

@app.get("/latest_block")
def get_latest_block():
    latest_block = blockchain.get_latest_block()
    return {"message": "Block added successfully", "block": latest_block}
