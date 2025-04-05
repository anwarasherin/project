const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./models/User");
const auth = require("./middlewares/auth");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost/project", {})
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log("Could not connect to mongodb", err);
  });

app.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const result = await user.save();
  res.send("Success");
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send("Invalid User or Password");
  }
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword) {
    return res.send("Invalid User or Password");
  }

  const token = jwt.sign({ _id: user._id }, "dummyTokenSecret");
  return res.header("x-auth-token", token).send("Login Successful");
});

app.get("/users", auth, async (req, res) => {
  res.send("You are in a protected route");
});

app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});
