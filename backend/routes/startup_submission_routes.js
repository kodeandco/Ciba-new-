const express = require("express");
const router = express.Router();
const StartupSubmission = require("../models/startup_submission_model");

// Test route (optional, you can keep it for debugging)
router.get("/test", (req, res) => {
  res.json({ message: "Startup submission route is working!" });
});

// ========== CRITICAL: GET all startup submissions ==========
router.get("/", async (req, res) => {
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

// Submit route (already working)
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

// ========== BONUS: Add these if not already present (for approve/reject/delete) ==========

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await StartupSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await StartupSubmission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;