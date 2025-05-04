const fs = require("fs").promises;
const path = require("path");

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

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

const folderPath = path.join(__dirname, "..", "uploads");

const createFolderIfNotExists = async () => {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    console.log("Folder created or already exists:", folderPath);
  } catch (err) {
    console.error("Error creating folder:", err);
  }
};

module.exports.createFolderIfNotExists = createFolderIfNotExists;
module.export = { sendResponse, createBlock };
