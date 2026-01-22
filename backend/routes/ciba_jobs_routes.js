const express = require("express");
const router = express.Router();
const CIBAJob = require("../models/ciba_job_model");
const authMiddleware = require("../middleware/authMiddleware");
// GET all CIBA jobs with type filter
router.get("/admin/ciba-jobs", async (req, res) => {
  try {
    const { type } = req.query;
    
    console.log("🔍 GET /admin/ciba-jobs - Query type:", type);
    
    const filter = {};
    if (type === "job" || type === "internship") {
      filter.type = type;
    }
    
    console.log("🔍 Filter:", filter);
    
    const jobs = await CIBAJob.find(filter).sort({ createdAt: -1 });
    
    console.log("✅ Found", jobs.length, "jobs");
    console.log("📋 Types:", jobs.map(j => ({ title: j.title, type: j.type })));
    
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("❌ Error fetching CIBA jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// POST - Add new CIBA job or internship
router.post("/admin/ciba-jobs", async (req, res) => {
  try {
    console.log("📝 POST /admin/ciba-jobs - Body:", req.body);
    
    const { 
      title, 
      type, 
      department, 
      description,
      responsibilities,
      requirements,
      location,
      salary,
      duration
    } = req.body;

    if (!title || !department || !description) {
      return res.status(400).json({ error: "Title, department, and description are required" });
    }

    if (!type || (type !== "job" && type !== "internship")) {
      return res.status(400).json({ error: "Type must be either 'job' or 'internship'" });
    }

    const newJob = new CIBAJob({ 
      title, 
      type, 
      department, 
      description,
      responsibilities: responsibilities || "",
      requirements: requirements || "",
      location: location || "",
      salary: salary || "",
      duration: duration || ""
    });
    
    const savedJob = await newJob.save();
    
    console.log("✅ Saved:", { id: savedJob._id, type: savedJob.type, title: savedJob.title });

    res.status(201).json({
      success: true,
      message: `CIBA ${type} added successfully!`,
      job: savedJob,
    });
  } catch (error) {
    console.error("❌ Error adding CIBA job:", error);
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
    console.error("❌ Error deleting CIBA job:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;