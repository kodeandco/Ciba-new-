const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const StartupClinic = require("../models/startup_clinic_model");

// -------------------------
// BOOKING API

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      slot,
      question1,
      question2,
      question3,
      subscribeNewsletter,
    } = req.body;

    if (!name || !email || !phone || !slot) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // 🔒 Prevent double slot booking
    const existing = await StartupClinic.findOne({ slot });

    if (existing) {
      return res.status(400).json({
  success: false,
  error: "This slot is already booked."
});

    }

    // Save to database
    const newBooking = new StartupClinic({
      name,
      email,
      phone,
      slot,
      question1,
      question2,
      question3,
      subscribeNewsletter,
    });

    await newBooking.save();

    // -------------------------
    // SEND CONFIRMATION EMAIL
   
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Startup Clinic <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Startup Clinic Slot is Confirmed!",
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Startup Clinic Booking Confirmed 🎉</h2>
        <p>Hi <strong>${name}</strong>,</p>

        <p>Your session has been successfully booked.</p>
        
        <h3>📅 Booking Details:</h3>
        <p><strong>Slot:</strong> ${slot}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <h3>📝 Your Questions:</h3>
        <p>1. ${question1}</p>
        <p>2. ${question2}</p>
        <p>3. ${question3}</p>

        <br/>
        <p>Thank you for booking your Startup Clinic session.</p>
        <p>- CIBA Team</p>
      </div>
      `,
    });

    return res.status(200).json({
  success: true,
  message: "Slot booked successfully!"
});

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
