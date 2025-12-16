const express = require("express");
const router = express.Router();
const Partner = require("../models/partners_model");

/* =====================================================
   CREATE PARTNER (POST)
   Expects:
   {
     name,
     description,
     image: base64 string (optional),
     contentType: "image/png" | "image/jpeg"
   }
===================================================== */
router.post("/", async (req, res) => {
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
        : undefined
    });

    await partner.save();
    res.status(201).json({ message: "Partner created", partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   GET ALL PARTNERS
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

/* =====================================================
   UPDATE PARTNER (PUT)
===================================================== */
router.put("/:id", async (req, res) => {
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

    await partner.save();
    res.json({ message: "Partner updated", partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   DELETE PARTNER
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: "Partner deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
