const express = require("express");
const router = express.Router();
const Partner = require("../models/partners_model");
const authMiddleware = require("../middleware/authMiddleware");

// ===================================
// PUBLIC ROUTES (No authentication)
// ===================================

/* =====================================================
   GET ALL PARTNERS (PUBLIC)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    const formatted = partners.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      image: p.image?.data
        ? `data:${p.image.contentType};base64,${p.image.data.toString("base64")}`
        : null
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================================
// PROTECTED ROUTES (Admin only)
// ===================================

/* =====================================================
   CREATE PARTNER (POST - PROTECTED)
   Expects:
   {
     name,
     description,
     image: base64 string (optional),
     contentType: "image/png" | "image/jpeg"
   }
===================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, image, contentType } = req.body;

    const partner = new Partner({
      name,
      description,
      image: image
        ? {
            data: Buffer.from(image, "base64"),
            contentType
          }
        : undefined,
      createdBy: req.user._id // Track who created it
    });

    await partner.save();
    res.status(201).json({ message: "Partner created", partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   UPDATE PARTNER (PUT - PROTECTED)
===================================================== */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, image, contentType } = req.body;

    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: "Partner not found" });

    partner.name = name ?? partner.name;
    partner.description = description ?? partner.description;

    if (image) {
      partner.image = {
        data: Buffer.from(image, "base64"),
        contentType
      };
    }

    partner.updatedBy = req.user._id; // Track who updated it

    await partner.save();
    res.json({ message: "Partner updated", partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   DELETE PARTNER (PROTECTED)
===================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }
    
    res.json({ message: "Partner deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;