const express = require("express");
const router = express.Router();

router.get("/blocks", (req, res) => {
  res.json(blockchain.getAllBlocks());
});

router.post("/blocks", (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "Data is required" });

  const newBlock = blockchain.addBlock(data);
  res.status(201).json(newBlock);
});

router.get("/validate", (req, res) => {
  const valid = blockchain.isChainValid();
  res.json({ valid });
});
