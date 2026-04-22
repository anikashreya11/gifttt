const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const users = [];

function buildToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET || "dev_jwt_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required"
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = users.some((user) => user.email === normalizedEmail);

  if (exists) {
    return res.status(409).json({
      message: "An account with this email already exists"
    });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = {
    id: randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  return res.status(201).json({
    message: "Registration successful",
    token: buildToken(user),
    user: toPublicUser(user)
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const isMatch = await bcrypt.compare(String(password), user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  return res.status(200).json({
    message: "Login successful",
    token: buildToken(user),
    user: toPublicUser(user)
  });
});

router.get("/profile", authMiddleware, (req, res) => {
  const user = users.find((entry) => entry.id === req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  return res.status(200).json({
    user: toPublicUser(user)
  });
});

module.exports = router;
