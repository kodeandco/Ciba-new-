const express = require("express");
const multer = require("multer");
const Newsletter = require("../models/newsletter_model");

const router = express.Router();

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes
// GET file by ID - MUST be before "/:id" route
router.get("/:id/file", async (req, res) => {
  console.log("📄 File route hit for ID:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      console.log("❌ Newsletter not found");
      return res.status(404).json({ error: "Newsletter not found" });
    }

    if (!newsletter.file || !newsletter.file.data) {
      console.log("❌ File not found for newsletter");
      return res.status(404).json({ error: "File not found" });
    }

    console.log("✅ Sending file:", newsletter.file.filename);

    // Set the content type from MongoDB
    res.set({
      "Content-Type": newsletter.file.contentType,
      "Content-Disposition": `inline; filename="${newsletter.file.filename}"`,
    });

    // Send the buffer directly
    res.send(newsletter.file.data);

  } catch (err) {
    console.error("❌ Error fetching file:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET top 2 latest newsletters (metadata only, no file data)
router.get("/", async (req, res) => {
  console.log("📋 Getting all newsletters");
  
  try {
    const newsletters = await Newsletter.find({})
      .sort({ newsletterDate: -1 })
      .limit(2)
      .select("-file.data"); // exclude binary data for performance
    
    console.log(`✅ Found ${newsletters.length} newsletters`);
    res.json(newsletters);
  } catch (err) {
    console.error("❌ Error fetching newsletters:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single newsletter by ID (with metadata, no file data)
router.get("/:id", async (req, res) => {
  console.log("📄 Getting newsletter by ID:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findById(req.params.id)
      .select("-file.data");
    
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    console.log("✅ Newsletter found:", newsletter.title);
    res.json(newsletter);
  } catch (err) {
    console.error("❌ Error fetching newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST new newsletter with file upload
router.post("/", upload.single("file"), async (req, res) => {
  console.log("📝 Creating new newsletter");
  
  try {
    const { title, description, newsletterDate } = req.body;

    if (!title || !description || !newsletterDate) {
      return res.status(400).json({ 
        error: "Missing required fields: title, description, or newsletterDate" 
      });
    }

    const newsletter = new Newsletter({
      title,
      description,
      newsletterDate: new Date(newsletterDate),
      file: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
        : undefined
    });

    await newsletter.save();
    console.log("✅ Newsletter created:", newsletter._id);
    res.status(201).json({ 
      message: "Newsletter created successfully",
      id: newsletter._id 
    });
  } catch (err) {
    console.error("❌ Error creating newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE newsletter by ID
router.delete("/:id", async (req, res) => {
  console.log("🗑️ Deleting newsletter:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    console.log("✅ Newsletter deleted");
    res.json({ message: "Newsletter deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;