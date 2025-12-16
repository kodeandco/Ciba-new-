// backend/routes/Graduated_startups_routes.js
const express = require("express");
const router = express.Router();
const GraduatedStartup = require("../models/graduated_startup_model");

// GET all graduated startups
router.get("/admin/graduated-startups", async (req, res) => {
  try {
    const startups = await GraduatedStartup.find({}).sort({ createdAt: -1 });
    res.json({ startups });
  } catch (error) {
    console.error("Error fetching graduated startups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Add new graduated startup
router.post("/admin/graduated-startups", async (req, res) => {
  try {
    const { companyName, tagline, careerUrl } = req.body;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newStartup = new GraduatedStartup({ companyName, tagline, careerUrl });
    const saved = await newStartup.save();

    res.status(201).json({ success: true, message: "Startup added!", startup: saved });
  } catch (error) {
    console.error("Error adding startup:", error);
    res.status(500).json({ error: "Failed to add startup" });
  }
});

// DELETE - Delete graduated startup by ID
router.delete("/admin/graduated-startups/:id", async (req, res) => {
  try {
    const deleted = await GraduatedStartup.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Startup not found" });
    }

    res.json({ success: true, message: "Startup deleted successfully" });
  } catch (error) {
    console.error("Error deleting startup:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;