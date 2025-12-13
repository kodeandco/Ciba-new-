const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplication = require("../models/job_application_model");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype =
      allowedTypes.test(file.mimetype) ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Job application route is working!" });
});

// Submit application (POST) - with file upload
router.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Create application object
    const applicationData = {
      positionId: req.body.positionId,
      positionTitle: req.body.positionTitle,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      resumeFilename: req.file.filename,
      coverLetter: req.body.coverLetter,
      linkedIn: req.body.linkedIn || "",
      portfolio: req.body.portfolio || ""
    };

    const application = new JobApplication(applicationData);
    const saved = await application.save();

    // Fixed: include success property
    res.status(200).json({
      success: true,
      message: "Application submitted successfully!",
      data: saved
    });
  } catch (err) {
    // If there's an error and file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
    }
    res.status(400).json({ error: err.message });
  }
});

// Get all applications (Admin)
router.get("/all", async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update application status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: application
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
