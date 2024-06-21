const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerControler = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "User created successfully",
      username,
      email,
      token,
      user: user._id,
    });
    console.log(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const loginControler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ message: "User logged in successfully", token, user: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerControler, loginControler };
