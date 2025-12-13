// backend/routes/incubated_startups_routes.js
const express = require("express");
const router = express.Router();
const IncubatedStartup = require("../models/incubated_startup_model");

// GET all incubated startups
router.get("/admin/incubated-startups", async (req, res) => {
  try {
    const startups = await IncubatedStartup.find({}).sort({ createdAt: -1 });
    res.json({ startups });
  } catch (error) {
    console.error("Error fetching incubated startups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Add new incubated startup
router.post("/admin/incubated-startups", async (req, res) => {
  try {
    const { companyName, tagline, careerUrl } = req.body;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newStartup = new IncubatedStartup({ companyName, tagline, careerUrl });
    const saved = await newStartup.save();

    res.status(201).json({ success: true, message: "Startup added!", startup: saved });
  } catch (error) {
    console.error("Error adding startup:", error);
    res.status(500).json({ error: "Failed to add startup" });
  }
});

// DELETE - Delete incubated startup by ID
router.delete("/admin/incubated-startups/:id", async (req, res) => {
  try {
    const deleted = await IncubatedStartup.findByIdAndDelete(req.params.id);

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