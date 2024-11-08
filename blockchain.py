import hashlib
import time
import json

# Block
class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

    def __repr__(self):
        return f"Block(index={self.index}, hash={self.hash}, previous_hash={self.previous_hash})"
    
# Blockchain
class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_genesis_block()

    def create_genesis_block(self):
        # Create the first block (genesis block) with arbitrary previous hash
        genesis_block = Block(0, "0", int(time.time()), "Genesis Block", calculate_hash(Block(0, "0", int(time.time()), "Genesis Block", "")))
        self.chain.append(genesis_block)

    def add_block(self, data):
        # Add a new block to the blockchain
        previous_block = self.chain[-1]
        new_block = Block(len(self.chain), previous_block.hash, int(time.time()), data, calculate_hash(Block(len(self.chain), previous_block.hash, int(time.time()), data, "")))
        self.chain.append(new_block)

    def is_chain_valid(self):
        # Check if the blockchain is valid by comparing the hash of each block
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # Check if the hash of the current block is correct
            if current_block.hash != calculate_hash(current_block):
                print(f"Invalid hash at block {current_block.index}")
                return False

            # Check if the previous block's hash is correct
            if current_block.previous_hash != previous_block.hash:
                print(f"Invalid previous hash at block {current_block.index}")
                return False

        return True

def calculate_hash(block):
    block_string = f"{block.index}{block.previous_hash}{block.timestamp}{block.data}"
    return hashlib.sha256(block_string.encode('utf-8')).hexdigest()


my_blockchain = Blockchain()

# Add some blocks with data
my_blockchain.add_block("First block data")
my_blockchain.add_block("Second block data")

# Print the blockchain
for block in my_blockchain.chain:
    print(block)

# Check if the blockchain is valid
print("Is the blockchain valid?", my_blockchain.is_chain_valid())