const express = require("express");
const { User } = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/store-key", auth, async (req, res) => {
  try {
    const { eccPublicKey } = req.body;

    if (!eccPublicKey || !eccPublicKey.includes("-----BEGIN PUBLIC KEY-----")) {
      return res.status(400).json({ error: "Invalid PEM public key format" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { eccPublicKey },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "ECC public key stored successfully" });
  } catch (err) {
    console.error("Error saving ECC public key:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
