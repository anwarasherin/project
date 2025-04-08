const mongoose = require("mongoose");

const File = mongoose.model(
  "File",
  new mongoose.Schema({
    encryptedFileName: {
      type: String,
    },
    originalFileName: {
      type: String,
    },
    encryptedBlockName: {
      type: String,
    },
    type: {
      type: String,
      enum: ["shared", "owned"],
      default: "owned",
    },
    ephemeralPublicKey: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
    },
  })
);

exports.FileModal = File;
