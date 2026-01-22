const express = require("express");
const multer = require("multer");
const Mentor = require("../models/mentors_model");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =====================================================
   ADD MENTOR
===================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      designation,
      department,
      message,
      linkedin,
      website
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const mentor = new Mentor({
      name,
      designation,
      department,
      message,
      socialMedia: {
        linkedin: linkedin || undefined,
        website: website || undefined
      },
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await mentor.save();

    res.status(201).json({
      message: "Mentor added successfully",
      mentor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   GET ALL MENTORS
===================================================== */
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({ createdAt: -1 });

    const formattedMentors = mentors.map((mentor) => ({
      _id: mentor._id,
      name: mentor.name,
      designation: mentor.designation,
      department: mentor.department,
      message: mentor.message,
      socialMedia: mentor.socialMedia,
      image: mentor.image?.data
        ? `data:${mentor.image.contentType};base64,${mentor.image.data.toString("base64")}`
        : null
    }));

    res.status(200).json(formattedMentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   GET SINGLE MENTOR
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json({
      _id: mentor._id,
      name: mentor.name,
      designation: mentor.designation,
      department: mentor.department,
      message: mentor.message,
      socialMedia: mentor.socialMedia,
      image: mentor.image?.data
        ? `data:${mentor.image.contentType};base64,${mentor.image.data.toString("base64")}`
        : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   UPDATE MENTOR
===================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      designation,
      department,
      message,
      linkedin,
      website
    } = req.body;

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    mentor.name = name || mentor.name;
    mentor.designation = designation || mentor.designation;
    mentor.department = department || mentor.department;
    mentor.message = message || mentor.message;

    mentor.socialMedia = {
      linkedin: linkedin || mentor.socialMedia?.linkedin || undefined,
      website: website || mentor.socialMedia?.website || undefined
    };

    if (req.file) {
      mentor.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await mentor.save();

    res.status(200).json({
      message: "Mentor updated successfully",
      mentor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   DELETE MENTOR
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;