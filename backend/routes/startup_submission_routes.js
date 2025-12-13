const express = require("express");
const router = express.Router();
const StartupSubmission = require("../models/startup_submission_model");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Startup submission route is working!" });
});

// Submit route
router.post("/submit", async (req, res) => {
  try {
    const submission = new StartupSubmission(req.body);
    const saved = await submission.save();
    res.status(201).json({ message: "Job opening submitted successfully!", data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
