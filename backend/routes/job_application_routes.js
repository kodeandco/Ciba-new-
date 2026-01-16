const express = require("express");
const router = express.Router();
const multer = require("multer");
const JobApplication = require("../models/job_application_model");
const CIBAJob = require("../models/ciba_job_model");
const IncubatedStartup = require("../models/incubated_startup_model");
const authMiddleware = require("../middleware/authMiddleware");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Job application route is working!" });
});

router.post("/apply", (req, res) => {
  upload.single("resume")(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error("❌ Multer Error:", err.message);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("❌ Error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      console.log("📥 Processing application");
      console.log("📄 File:", req.file ? req.file.originalname : "NO FILE");

      if (!req.file) {
        return res.status(400).json({ error: "Resume file is required" });
      }

      let positionType = "";
      const cibaJob = await CIBAJob.findById(req.body.positionId);
      if (cibaJob) {
        positionType = `ciba-${cibaJob.type}`;
      } else {
        const startup = await IncubatedStartup.findById(req.body.positionId);
        if (startup) {
          positionType = "startup";
        } else {
          positionType = "unknown";
        }
      }

      const applicationData = {
        positionId: req.body.positionId,
        positionTitle: req.body.positionTitle,
        positionType: positionType,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        resume: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        },
        coverLetter: req.body.coverLetter,
        linkedIn: req.body.linkedIn || "",
        portfolio: req.body.portfolio || ""
      };

      const application = new JobApplication(applicationData);
      const saved = await application.save();

      console.log("✅ Application saved! ID:", saved._id);

      res.status(200).json({
        success: true,
        message: "Application submitted successfully!",
        data: {
          _id: saved._id,
          fullName: saved.fullName,
          email: saved.email,
          positionTitle: saved.positionTitle
        }
      });
    } catch (error) {
      console.error("❌ Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
});

router.get("/all", async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .select("-resume.data")
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// IMPORTANT: Specific routes BEFORE generic /:id
router.get("/:id/resume", async (req, res) => {
  try {
    console.log("📥 Resume download:", req.params.id);
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.set({
      "Content-Type": application.resume.contentType,
      "Content-Disposition": `attachment; filename="${application.resume.filename}"`
    });
    res.send(application.resume.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    console.log("📝 Status update:", req.params.id, "to:", req.body.status);
    const { status } = req.body;
    
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-resume.data");

    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    console.log("✅ Status updated!");
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: application
    });
  } catch (err) {
    console.error("❌ Status error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE route MUST be before GET /:id
router.delete("/:id", async (req, res) => {
  console.log("=================================");
  console.log("🗑️ DELETE ROUTE MATCHED!");
  console.log("ID:", req.params.id);
  console.log("Method:", req.method);
  console.log("Full URL:", req.originalUrl);
  console.log("=================================");
  
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    console.log("✅ DELETED:", application.fullName);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /:id MUST be LAST
router.get("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).select("-resume.data");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;