const multer = require("multer");
const { v4 } = require("uuid");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const key = v4();
    cb(null, key + ".enc");
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);

  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const memoryStorage = multer.memoryStorage();

const uploadFile = multer({ storage: fileStorage }).single("file");
const uploadMemory = multer({ storage: memoryStorage }).single("file");

module.exports = { uploadFile, uploadMemory };
