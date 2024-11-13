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

blockchain =  Blockchain()
blockchain.add_block("Dummy Data")
print(blockchain.chain)