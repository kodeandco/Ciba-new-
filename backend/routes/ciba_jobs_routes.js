// backend/routes/ciba_jobs_routes.js
const express = require("express");
const router = express.Router();
const CIBAJob = require("../models/ciba_job_model");

// GET all CIBA jobs
router.get("/admin/ciba-jobs", async (req, res) => {
  try {
    const jobs = await CIBAJob.find({}).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching CIBA jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// POST - Add new CIBA job
router.post("/admin/ciba-jobs", async (req, res) => {
  try {
    const { title, type = "Full-time", department, description } = req.body;

    if (!title || !department || !description) {
      return res.status(400).json({ error: "Title, department, and description are required" });
    }

    const newJob = new CIBAJob({ title, type, department, description });
    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "CIBA job added successfully!",
      job: savedJob,
    });
  } catch (error) {
    console.error("Error adding CIBA job:", error);
    res.status(500).json({ error: error.message || "Failed to add job" });
  }
});

// DELETE - Delete CIBA job by ID
router.delete("/admin/ciba-jobs/:id", async (req, res) => {
  try {
    const deletedJob = await CIBAJob.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true, message: "CIBA job deleted successfully" });
  } catch (error) {
    console.error("Error deleting CIBA job:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;