const express = require("express");
const router = express.Router();
const StartupSubmission = require("../models/startup_submission_model");
const authMiddleware = require("../middleware/authMiddleware");

// ===================================
// PUBLIC ROUTES (No authentication)
// ===================================

// Test route (optional, for debugging)
router.get("/test", (req, res) => {
  res.json({ message: "Startup submission route is working!" });
});

// Submit route (PUBLIC - anyone can submit job postings)
router.post("/submit", async (req, res) => {
  try {
    const submission = new StartupSubmission(req.body);
    const saved = await submission.save();
    res.status(201).json({ 
      success: true,
      message: "Job opening submitted successfully!", 
      data: saved 
    });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ===================================
// PROTECTED ROUTES (Admin only)
// ===================================

// GET all startup submissions (PROTECTED)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const submissions = await StartupSubmission.find()
      .sort({ createdAt: -1 }) // newest first
      .lean();

    // This format matches what your frontend expects
    res.json({ submissions });
  } catch (err) {
    console.error("Error fetching startup submissions:", err);
    res.status(500).json({ error: "Failed to fetch startup job postings" });
  }
});

// Update submission status (PROTECTED)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await StartupSubmission.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedBy: req.user._id // Track who updated it
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete submission (PROTECTED)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await StartupSubmission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;