// backend/routes/graduated_startups_route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const GraduatedStartup = require("../models/graduated_startup_model");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// GET all graduated startups (without image data for performance)
router.get("/admin/graduated-startups", async (req, res) => {
  try {
    const startups = await GraduatedStartup.find({})
      .select("-image.data") // Exclude image data from list
      .sort({ createdAt: -1 });
    
    // Add hasImage flag
    const startupsWithImageFlag = startups.map(startup => ({
      ...startup.toObject(),
      hasImage: !!(startup.image && startup.image.contentType)
    }));
    
    res.json({ startups: startupsWithImageFlag });
  } catch (error) {
    console.error("Error fetching graduated startups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single startup image
router.get("/admin/graduated-startups/:id/image", async (req, res) => {
  try {
    const startup = await GraduatedStartup.findById(req.params.id);

    if (!startup || !startup.image || !startup.image.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", startup.image.contentType);
    res.send(startup.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// POST - Add new graduated startup (with optional image)
router.post("/admin/graduated-startups", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    const companyName = req.body.companyName;
    const tagline = req.body.tagline;
    const careerUrl = req.body.careerUrl;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const startupData = { companyName, tagline, careerUrl };

    // Add image if uploaded
    if (req.file) {
      startupData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const newStartup = new GraduatedStartup(startupData);
    const saved = await newStartup.save();

    res.status(201).json({ 
      success: true, 
      message: "Startup added!", 
      startup: {
        ...saved.toObject(),
        image: saved.image ? { contentType: saved.image.contentType } : null
      }
    });
  } catch (error) {
    console.error("Error adding startup:", error);
    res.status(500).json({ error: "Failed to add startup" });
  }
});

// PUT - Update graduated startup (with optional image)
router.put("/admin/graduated-startups/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file);
    
    const companyName = req.body.companyName;
    const tagline = req.body.tagline;
    const careerUrl = req.body.careerUrl;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updateData = { companyName, tagline, careerUrl };

    // Add image if uploaded
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updated = await GraduatedStartup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Startup not found" });
    }

    res.json({ 
      success: true, 
      message: "Startup updated successfully", 
      startup: {
        ...updated.toObject(),
        image: updated.image ? { contentType: updated.image.contentType } : null
      }
    });
  } catch (error) {
    console.error("Error updating startup:", error);
    res.status(500).json({ error: "Update failed" });
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