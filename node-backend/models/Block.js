const mongoose = require("mongoose");

const Block = mongoose.model(
  "Block",
  new mongoose.Schema({
    index: { type: Number, required: true, unique: false },
    timestamp: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    previousHash: { type: String, required: true },
    hash: { type: String, required: true },
  })
);

exports.Block = Block;
