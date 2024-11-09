class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash

    def __repr__(self):
        return f"Block(index={self.index}, hash={self.hash}, previous_hash={self.previous_hash})"

block1 = Block(1, "0", 1234567890, "Some data", "abcd1234")
block2 = Block(1, "abcd1234", 1234567890, "Some data", "abcd1235")

print(block1,block2)