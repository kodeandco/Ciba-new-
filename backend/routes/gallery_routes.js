const express = require("express");
const multer = require("multer");
const Gallery = require("../models/gallery_model");

const router = express.Router();

// Multer config (store image in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/**
 * POST – Upload image (Admin)
 */
const sharp = require("sharp");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Compress and resize image
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const galleryItem = new Gallery({
      title,
      description,
      image: {
        data: processedImage,
        contentType: "image/jpeg",
        filename: req.file.originalname,
      },
    });

    await galleryItem.save();
    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});
// PATCH – Edit gallery item
router.patch("/:id", async (req, res) => {
  try {
    const { title, description } = req.body
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: "Item not found" })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET – Fetch all gallery items (metadata only, no image data)
 */
router.get("/", async (req, res) => {
  try {
    // Exclude the large binary data field from the query
    const galleryItems = await Gallery.find()
      .select("-image.data") // Exclude binary data
      .sort({ createdAt: -1 }); // Most recent first

    res.json(galleryItems);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET – Serve image by ID
 */
router.get("/:id/image", async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem || !galleryItem.image?.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set proper headers and send buffer directly
    res.set("Content-Type", galleryItem.image.contentType);
    res.set("Content-Length", galleryItem.image.data.length);
    res.set("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    res.send(galleryItem.image.data);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE – Delete gallery item by ID (Admin)
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;