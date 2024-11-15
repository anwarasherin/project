from fastapi import FastAPI, HTTPException
import time
from utils import calculate_hash
class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

    def __repr__(self):
        return f"Block(index={self.index}, hash={self.hash}, previous_hash={self.previous_hash})"

# Blockchain class
class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(
            0, "0", int(time.time()), "Genesis Block", 
            calculate_hash(Block(0, "0", int(time.time()), "Genesis Block", ""))
        )
        self.chain.append(genesis_block)

    def add_block(self, data):
        previous_block = self.chain[-1]
        new_block = Block(
            len(self.chain),
            previous_block.hash,
            int(time.time()),
            data,
            calculate_hash(Block(len(self.chain), previous_block.hash, int(time.time()), data, ""))
        )
        self.chain.append(new_block)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Validate current block hash
            if current_block.hash != calculate_hash(current_block):
                return False

            # Validate previous hash
            if current_block.previous_hash != previous_block.hash:
                return False
        return True

blockchain =  Blockchain()
blockchain.add_block("Dummy Data")
print(blockchain.chain)
blockchain.chain[0].hash = "kndjdn"
print(blockchain.is_chain_valid())


# FastAPI app setup
app = FastAPI()
blockchain = Blockchain()

# API Endpoints
@app.get("/")
def get_root():
    return {"message": "Welcome to the Blockchain Server!"}

@app.get("/blocks")
def get_blocks():
    return [{"index": block.index, "previous_hash": block.previous_hash, "timestamp": block.timestamp, "data": block.data, "hash": block.hash} for block in blockchain.chain]
