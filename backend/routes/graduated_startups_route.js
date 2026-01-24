// backend/routes/graduated_startups_route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const GraduatedStartup = require("../models/graduated_startup_model");
const authMiddleware = require("../middleware/authMiddleware");

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

// ===================================
// PROTECTED ROUTES (Admin only) - MUST COME FIRST
// ===================================

// GET all graduated startups for admin panel (PROTECTED)
router.get("/admin/graduated-startups", authMiddleware, async (req, res) => {
  try {
    const startups = await GraduatedStartup.find({})
      .select("-image.data") // Exclude image data from list
      .sort({ createdAt: -1 });
    
    // Add hasImage flag
    const startupsWithImageFlag = startups.map(startup => ({
      ...startup.toObject(),
      hasImage: !!(startup.image && startup.image.contentType)
    }));
    
    res.json({ 
      success: true,
      startups: startupsWithImageFlag 
    });
  } catch (error) {
    console.error("Error fetching graduated startups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST - Add new graduated startup (PROTECTED)
router.post("/admin/graduated-startups", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Authenticated admin:", req.user.email);
    
    const { companyName, tagline, careerUrl } = req.body;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const startupData = { 
      companyName, 
      tagline, 
      careerUrl,
      createdBy: req.user._id
    };

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
      message: "Startup added successfully!", 
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

// GET single startup image for admin (PUBLIC - images can't use auth headers in img tags)
router.get("/admin/graduated-startups/:id/image", async (req, res) => {
  try {
    const startup = await GraduatedStartup.findById(req.params.id);

    if (!startup || !startup.image || !startup.image.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", startup.image.contentType);
    res.set("Cache-Control", "public, max-age=3600"); // 1 hour cache
    res.send(startup.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// PUT - Update graduated startup (PROTECTED)
router.put("/admin/graduated-startups/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file);
    console.log("Authenticated admin:", req.user.email);
    
    const { companyName, tagline, careerUrl } = req.body;

    if (!companyName || !tagline || !careerUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updateData = { 
      companyName, 
      tagline, 
      careerUrl,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

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

// DELETE - Delete graduated startup by ID (PROTECTED)
router.delete("/admin/graduated-startups/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Delete request by admin:", req.user.email);
    
    const deleted = await GraduatedStartup.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Startup not found" });
    }

    res.json({ 
      success: true, 
      message: "Startup deleted successfully",
      deletedId: req.params.id 
    });
  } catch (error) {
    console.error("Error deleting startup:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ===================================
// PUBLIC ROUTES (No authentication) - MUST COME AFTER PROTECTED ROUTES
// ===================================

// GET all graduated startups - PUBLIC (WITH image data as base64)
router.get("/graduated-startups", async (req, res) => {
  try {
    const startups = await GraduatedStartup.find({})
      .sort({ createdAt: -1 });
    
    // Transform startups to include base64 encoded images
    const startupsWithImages = startups.map(startup => {
      const startupObj = startup.toObject();
      
      // Convert image buffer to base64 if image exists
      if (startupObj.image && startupObj.image.data) {
        return {
          ...startupObj,
          image: {
            contentType: startupObj.image.contentType,
            data: startupObj.image.data.toString('base64')
          }
        };
      }
      
      // Return startup without image data if no image
      return {
        ...startupObj,
        image: null
      };
    });
    
    res.json({ startups: startupsWithImages });
  } catch (error) {
    console.error("Error fetching graduated startups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single startup image - PUBLIC (kept for backward compatibility)
router.get("/graduated-startups/:id/image", async (req, res) => {
  try {
    const startup = await GraduatedStartup.findById(req.params.id);

    if (!startup || !startup.image || !startup.image.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", startup.image.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(startup.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

module.exports = router;