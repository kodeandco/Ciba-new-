// server.js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");

const app = express();
app.use(express.json());

// Connect Database
connectDB();

// Basic test route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Example Protected Route
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Protected data accessed", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Running on port ${PORT}`));
