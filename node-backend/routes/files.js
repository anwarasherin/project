const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { uploadMemory } = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const { FileModal } = require("../models/File");
const { Block } = require("../models/Block");
const { createBlock } = require("../routes/blocks");
const { sha256, xorShaHashes, encryptWithECC } = require("../utils/ecc");
const { encryptAES } = require("../utils/ecc");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const files = await FileModal.find({ user: userId });

    return res
      .status(200)
      .json({ message: "Files Fetched Successfully", data: { files } });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/encrypted-file", uploadMemory, auth, async (req, res) => {
  try {
    const ownerId = req.user._id;
    const ownerPublicKey = req.user.eccPublicKey;
    const originalname = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const fileContent = fileBuffer.toString();
    const fileContentSha256 = sha256(fileContent);
    const sharedUsers = JSON.parse(req.body.shared);

    const latestBlock = await Block.findOne().sort({ index: -1 });
    const aesKey = xorShaHashes(fileContentSha256, latestBlock.hash);

    const encryptedFileContent = encryptAES(fileContent, aesKey);
    const encryptedFileName = uuid() + ".enc";
    const encryptedBlockName = uuid() + ".enc";
    const newOwnerBlock = await createBlock(aesKey);
    const { encryptedMessage: encryptedBlock, ephemeralPublicKeyPEM } =
      encryptWithECC(ownerPublicKey, JSON.stringify(newOwnerBlock));

    uploadFileToStorage(encryptedBlockName, encryptedBlock);
    uploadFileToStorage(encryptedFileName, encryptedFileContent);

    const ownerFileItem = new FileModal({
      encryptedFileName: encryptedFileName,
      originalFileName: originalname,
      type: "owned",
      user: ownerId,
      block: newOwnerBlock._id,
      ephemeralPublicKey: ephemeralPublicKeyPEM,
    });

    await ownerFileItem.save();

    sharedUsers.forEach(async (sharedUser) => {
      const newSharedUserBlock = await createBlock(aesKey);
      const encryptedShardUserBlockName = uuid() + ".enc";
      const {
        encryptedMessage: sharedUserEncryptedBlock,
        sharedUserEphemeralPublicKeyPEM,
      } = encryptWithECC(
        sharedUser.eccPublicKey,
        JSON.stringify(newSharedUserBlock)
      );

      uploadFileToStorage(
        encryptedShardUserBlockName,
        sharedUserEncryptedBlock
      );

      const sharedUserFileItem = new FileModal({
        encryptedFileName: encryptedFileName,
        originalFileName: originalname,
        type: "shared",
        user: sharedUser._id,
        block: newSharedUserBlock._id,
        ephemeralPublicKey: sharedUserEphemeralPublicKeyPEM,
      });

      await sharedUserFileItem.save();
    });

    res.status(201).send({ message: "Encrypted file uploaded" });
  } catch (ex) {
    res.send("Error");
  }
});

const uploadFileToStorage = (filename, content) => {
  fs.writeFile("uploads/" + filename, content, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File created and data written!");
    }
  });
};

module.exports = router;
