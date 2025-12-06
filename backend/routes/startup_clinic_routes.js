const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const StartupClinic = require("../models/startup_clinic_model");

// -------------------------
// GET ALL BOOKINGS (Admin route)
// -------------------------
router.get("/", async (req, res) => {
  try {
    const bookings = await StartupClinic.find().sort({ sessionDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// BOOKING API (Create new booking)
// -------------------------
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      slot,
      sessionDate,
      question1,
      question2,
      question3,
      subscribeNewsletter,
    } = req.body;

    if (!name || !email || !phone || !slot || !sessionDate) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Normalize date to midnight for consistent comparison
    const dateObj = new Date(sessionDate);
    dateObj.setHours(0, 0, 0, 0);
    
    // Create end of day
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    // 🔒 Prevent double slot booking for the same date and time
    const existing = await StartupClinic.findOne({ 
      sessionDate: {
        $gte: dateObj,
        $lte: endOfDay
      },
      slot: slot 
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "This slot is already booked for the selected date. Please choose another time slot."
      });
    }

    // Store user's details
    const userEmail = email;
    const userPhone = phone;
    const userName = name;
    const userSlot = slot;
    
    // Store normalized date (midnight)
    const normalizedDate = new Date(dateObj);
    normalizedDate.setHours(0, 0, 0, 0);

    // Format date for display in emails
    const formattedDate = normalizedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Save to database
    const newBooking = new StartupClinic({
      name: userName,
      email: userEmail,
      phone: userPhone,
      slot: userSlot,
      sessionDate: normalizedDate, // Store as Date object (midnight)
      question1,
      question2,
      question3,
      subscribeNewsletter,
    });

    await newBooking.save();

    // -------------------------
    // SEND CONFIRMATION EMAIL TO THE USER
   
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to the USER
    await transporter.sendMail({
      from: `Startup Clinic <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Startup Clinic Slot is Confirmed!",
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Startup Clinic Booking Confirmed 🎉</h2>
        <p>Hi <strong>${userName}</strong>,</p>

        <p>Your session has been successfully booked.</p>
        
        <h3>📅 Booking Details:</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time Slot:</strong> ${userSlot}</p>
        <p><strong>Phone:</strong> ${userPhone}</p>

        <h3>📝 Your Questions:</h3>
        <p>1. ${question1}</p>
        <p>2. ${question2}</p>
        <p>3. ${question3}</p>

        <br/>
        <p>We look forward to meeting you!</p>
        <p>- CIBA Team</p>
      </div>
      `,
    });

    // -------------------------
    // SEND NOTIFICATION EMAIL TO ADMIN
    // -------------------------
    await transporter.sendMail({
      from: `CIBA Startup Clinic System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Startup Clinic Booking: ${userName} - ${formattedDate}`,
      html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>📅 New Startup Clinic Booking</h2>
        
        <h3>Session Details:</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time Slot:</strong> ${userSlot}</p>

        <h3>Participant Information:</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Phone:</strong> ${userPhone}</p>
        <p><strong>Newsletter Subscription:</strong> ${subscribeNewsletter ? "Yes" : "No"}</p>

        <h3>Questions Submitted:</h3>
        <p><strong>Question 1:</strong> ${question1}</p>
        <p><strong>Question 2:</strong> ${question2}</p>
        <p><strong>Question 3:</strong> ${question3}</p>

        <br/>
        <p style="color: #666; font-size: 12px;">Booking ID: ${newBooking._id}</p>
      </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Slot booked successfully! Confirmation email sent to " + userEmail
    });

  } catch (err) {
    console.error("Booking error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "This slot is already booked for the selected date. Please choose another time slot." 
      });
    }
    
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// GET SINGLE BOOKING BY ID
// -------------------------
router.get("/:id", async (req, res) => {
  try {
    const booking = await StartupClinic.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// DELETE BOOKING (Optional)
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const booking = await StartupClinic.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Booking deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;