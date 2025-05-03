const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const blockRoutes = require("./routes/blocks");
const fileRoutes = require("./routes/files");
const { initializeEC } = require("./utils/ecc");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/files", fileRoutes);

initializeEC();

mongoose
  .connect(
    "mongodb+srv://test_user:okJDmCHz0Kw4a4yt@cluster0.jkmlp.mongodb.net/project"
  )
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log("Could not connect to mongodb", err);
  });

app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});
