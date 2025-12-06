// routes/incubation_routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const Incubation = require("../models/incubation_models");

// Configure multer to store in memory (as Buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// -------------------------
// INCUBATION APPLICATION API
// -------------------------

router.post("/", upload.single("pitchDeck"), async (req, res) => {
  try {
    const {
      founderName,
      coFounders,
      email,
      phone,
      startupName,
      industry,
      stage,
      teamSize,
      fundingRaised,
      revenue,
      website,
      description,
    } = req.body;

    // Validate required fields
    if (
      !founderName ||
      !email ||
      !phone ||
      !startupName ||
      !industry ||
      !stage ||
      !teamSize ||
      !fundingRaised ||
      !revenue ||
      !website ||
      !description
    ) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Check if pitch deck was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Pitch deck is required" });
    }

    // Save to database with file as Buffer
    const newApplication = new Incubation({
      founderName,
      coFounders: coFounders || "",
      email,
      phone,
      startupName,
      industry,
      stage,
      teamSize,
      fundingRaised,
      revenue,
      website,
      description,
      pitchDeck: {
        data: req.file.buffer, // Store file buffer directly
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        size: req.file.size,
      },
    });

    await newApplication.save();

    // -------------------------
    // SEND CONFIRMATION EMAIL TO APPLICANT
    // -------------------------

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to applicant with pitch deck attached
    await transporter.sendMail({
      from: `CIBA Incubation Program <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Incubation Program Application Received",
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>🚀 Application Received!</h2>
        <p>Hi <strong>${founderName}</strong>,</p>

        <p>Thank you for applying to the CIBA Incubation Program. We have successfully received your application and pitch deck.</p>
        
        <h3>📋 Application Details:</h3>
        <p><strong>Startup Name:</strong> ${startupName}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Stage:</strong> ${stage}</p>
        <p><strong>Team Size:</strong> ${teamSize}</p>
        <p><strong>Website:</strong> <a href="${website}">${website}</a></p>

        <h3>⏳ What's Next?</h3>
        <p>Our selection committee will review your application and pitch deck. We'll contact you within 10 business days regarding the next steps.</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>CIBA Incubation Team</strong></p>
      </div>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
    });

    // -------------------------
    // SEND NOTIFICATION EMAIL TO ADMIN
    // -------------------------

    await transporter.sendMail({
      from: `CIBA Incubation System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Incubation Application: ${startupName}`,
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>🚀 New Incubation Program Application</h2>
        
        <h3>Founder Information:</h3>
        <p><strong>Lead Founder:</strong> ${founderName}</p>
        <p><strong>Co-Founders:</strong> ${coFounders || "None"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <h3>Startup Information:</h3>
        <p><strong>Startup Name:</strong> ${startupName}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Stage:</strong> ${stage}</p>
        <p><strong>Team Size:</strong> ${teamSize}</p>
        <p><strong>Funding Raised:</strong> ${fundingRaised}</p>
        <p><strong>Monthly Revenue:</strong> ${revenue}</p>
        <p><strong>Website:</strong> <a href="${website}">${website}</a></p>

        <h3>Description:</h3>
        <p>${description}</p>

        <h3>📎 Attached Documents:</h3>
        <p>Pitch deck is attached to this email for your review.</p>

        <br/>
        <p style="color: #666; font-size: 12px;">Application ID: ${newApplication._id}</p>
      </div>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: newApplication._id,
    });
  } catch (err) {
    console.error("Incubation application error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// -------------------------
// GET ALL APPLICATIONS (Admin route)
// -------------------------

router.get("/", async (req, res) => {
  try {
    // Don't send pitch deck buffer in list view (too heavy)
    const applications = await Incubation.find()
      .select("-pitchDeck.data") // Exclude buffer data
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// GET SINGLE APPLICATION BY ID (with pitch deck)
// -------------------------

router.get("/:id", async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// DOWNLOAD PITCH DECK
// -------------------------

router.get("/:id/pitch-deck", async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Set headers for file download
    res.set({
      "Content-Type": application.pitchDeck.contentType,
      "Content-Disposition": `attachment; filename="${application.pitchDeck.filename}"`,
      "Content-Length": application.pitchDeck.size,
    });

    // Send buffer as file
    res.send(application.pitchDeck.data);
  } catch (err) {
    console.error("Error downloading pitch deck:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// VIEW PITCH DECK (inline in browser)
// -------------------------

router.get("/:id/pitch-deck/view", async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Set headers for inline viewing
    res.set({
      "Content-Type": application.pitchDeck.contentType,
      "Content-Disposition": `inline; filename="${application.pitchDeck.filename}"`,
    });

    // Send buffer for viewing
    res.send(application.pitchDeck.data);
  } catch (err) {
    console.error("Error viewing pitch deck:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// UPDATE APPLICATION STATUS (Admin route)
// -------------------------

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "under_review", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Incubation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-pitchDeck.data"); // Don't send buffer in response

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ success: true, application });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;