const express = require("express");
const crypto = require("crypto");
const auth = require("../middlewares/auth");
const { Block } = require("../models/Block");

const router = express.Router();

function calculateHash(index, timestamp, data, previousHash) {
  return crypto
    .createHash("sha256")
    .update(index + previousHash + timestamp + JSON.stringify(data))
    .digest("hex");
}

router.get("/latest", auth, async (req, res) => {
  const latestBlock = await Block.findOne().sort({ index: -1 });
  if (!latestBlock) return res.status(404).json({ error: "No blocks yet" });
  res.json(latestBlock);
});

router.get("/", auth, async (req, res) => {
  const allBlocks = await Block.find().sort({ index: 1 });
  if (!allBlocks) return res.status(404).json({ error: "No blocks yet" });
  res.json(allBlocks);
});

router.post("/", async (req, res) => {
  try {
    const { key: data } = req.body;
    const newBlock = await createBlock(data);
    res.status(201).json(newBlock);
  } catch (error) {
    console.error("Error creating block:", error);
    res.status(500).json({ error: "Failed to create block" });
  }
});

async function createGenesisBlockIfNeeded() {
  const existing = await Block.findOne({ index: 0 });
  if (existing) {
    console.log("✅ Genesis block already exists");
    return;
  }

  const index = 0;
  const timestamp = Date.now().toString();
  const data = "Genesis Block";
  const previousHash = "0";
  const hash = calculateHash(index, timestamp, data, previousHash);

  const genesisBlock = new Block({
    index,
    timestamp,
    data,
    previousHash,
    hash,
  });
  await genesisBlock.save();
  console.log("🌱 Genesis block created");
}

(async function () {
  await createGenesisBlockIfNeeded();
})();

const createBlock = async (data) => {
  const previousBlock = await Block.findOne().sort({ index: -1 });
  const index = previousBlock ? previousBlock.index + 1 : 1;
  const previousHash = previousBlock ? previousBlock.hash : "0";
  const timestamp = Date.now().toString();
  const hash = calculateHash(index, timestamp, data, previousHash);

  const newBlock = new Block({ index, timestamp, data, previousHash, hash });
  await newBlock.save();

  return newBlock;
};

module.exports = router;
module.exports.createBlock = createBlock;
