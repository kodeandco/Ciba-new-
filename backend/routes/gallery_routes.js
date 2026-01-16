const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Gallery = require("../models/gallery_model");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const isValid = allowedTypes.test(file.mimetype);
    cb(null, isValid);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, aspectRatio = "16:9" } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    let processedData = req.file.buffer;

    // Only process images with sharp
    if (!isVideo) {
      const dimensions = aspectRatio === "9:16" 
        ? { width: 1080, height: 1920 }
        : { width: 1920, height: 1080 };

      processedData = await sharp(req.file.buffer)
        .resize(dimensions.width, dimensions.height, { 
          fit: "cover", 
          position: "center" 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    const galleryItem = new Gallery({
      title,
      description,
      aspectRatio,
      mediaType: isVideo ? "video" : "image",
      image: {
        data: processedData,
        contentType: isVideo ? req.file.mimetype : "image/jpeg",
        filename: req.file.originalname,
      },
    });

    await galleryItem.save();
    res.status(201).json({ message: "Media uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title, description, aspectRatio } = req.body;
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, description, aspectRatio },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const galleryItems = await Gallery.find()
      .select("-image.data")
      .sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/image", async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem || !galleryItem.image?.data) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.set("Content-Type", galleryItem.image.contentType);
    res.set("Content-Length", galleryItem.image.data.length);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(galleryItem.image.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    res.json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;