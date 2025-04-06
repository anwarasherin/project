const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const filesRoutes = require("./routes/files");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);

mongoose
  .connect("mongodb://localhost/project", {})
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log("Could not connect to mongodb", err);
  });

app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});
