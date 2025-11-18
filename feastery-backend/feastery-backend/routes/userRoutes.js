const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "FEASTERY_SECRET_2025"; // keep private

// ---------------------- SIGNUP ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ success: true, message: "Signup success" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

    res.json({
      success: true,
      message: "Login success",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ---------------------- GET ALL USERS (admin) ----------------------
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
