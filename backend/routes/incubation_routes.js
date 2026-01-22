// routes/incubation_routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const Incubation = require("../models/incubation_models");
const { sendIncubationStatusEmail } = require("../utils/emailService");
const authMiddleware = require("../middleware/authMiddleware");

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

// ===================================
// PUBLIC ROUTES (No authentication)
// ===================================

// -------------------------
// INCUBATION APPLICATION API (PUBLIC - for applicants)
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
        data: req.file.buffer,
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

// ===================================
// PROTECTED ROUTES (Admin only)
// ===================================

// -------------------------
// GET ALL APPLICATIONS (Admin route - PROTECTED)
// -------------------------

router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Incubation.find()
      .select("-pitchDeck.data")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// GET SINGLE APPLICATION BY ID (PROTECTED)
// -------------------------

router.get("/:id", authMiddleware, async (req, res) => {
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
// DOWNLOAD PITCH DECK (PROTECTED)
// -------------------------

router.get("/:id/pitch-deck", authMiddleware, async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.set({
      "Content-Type": application.pitchDeck.contentType,
      "Content-Disposition": `attachment; filename="${application.pitchDeck.filename}"`,
      "Content-Length": application.pitchDeck.size,
    });

    res.send(application.pitchDeck.data);
  } catch (err) {
    console.error("Error downloading pitch deck:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// VIEW PITCH DECK (inline in browser - PROTECTED)
// -------------------------

router.get("/:id/pitch-deck/view", authMiddleware, async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.set({
      "Content-Type": application.pitchDeck.contentType,
      "Content-Disposition": `inline; filename="${application.pitchDeck.filename}"`,
    });

    res.send(application.pitchDeck.data);
  } catch (err) {
    console.error("Error viewing pitch deck:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// UPDATE APPLICATION STATUS (Admin route - PROTECTED)
// -------------------------

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "under_review", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Incubation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ 
      success: true, 
      application: {
        ...application.toObject(),
        pitchDeck: {
          filename: application.pitchDeck.filename,
          size: application.pitchDeck.size,
          contentType: application.pitchDeck.contentType,
        }
      },
      message: "Status updated successfully"
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// SEND STATUS EMAIL (Admin route - PROTECTED)
// -------------------------

router.post("/:id/send-email", authMiddleware, async (req, res) => {
  try {
    const application = await Incubation.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const emailResult = await sendIncubationStatusEmail(application, application.status);
    
    if (emailResult.success) {
      console.log(`✅ Status email sent successfully to ${application.email}`);
      return res.status(200).json({ 
        success: true, 
        message: "Email sent successfully",
        emailSent: true
      });
    } else {
      console.error(`⚠️ Email failed: ${emailResult.error}`);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to send email",
        details: emailResult.error
      });
    }
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// UPDATE APPLICATION NOTES (Admin route - PROTECTED)
// -------------------------

router.patch("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const application = await Incubation.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    ).select("-pitchDeck.data");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ 
      success: true, 
      application,
      message: "Notes updated successfully"
    });
  } catch (err) {
    console.error("Error updating notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;