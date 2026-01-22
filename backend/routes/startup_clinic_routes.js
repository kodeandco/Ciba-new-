const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const StartupClinic = require("../models/startup_clinic_model");
const { createCalendarEvent } = require("../utils/googleCalendar");
const authMiddleware = require("../middleware/authMiddleware");

// ===================================
// PUBLIC ROUTES (No authentication)
// ===================================

// -------------------------
// CHECK SLOT AVAILABILITY FOR A DATE (PUBLIC - MUST BE BEFORE /:id ROUTE)
// -------------------------
router.get("/availability/:date", async (req, res) => {
  try {
    const { date } = req.params;
    
    // Parse the date and normalize to midnight
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find all bookings for this date
    const bookings = await StartupClinic.find({
      sessionDate: {
        $gte: dateObj,
        $lte: endOfDay
      }
    }).select('slot');
    
    // Extract booked slots
    const bookedSlots = bookings.map(b => b.slot);
    
    res.status(200).json({ 
      success: true, 
      bookedSlots,
      availableCount: 5 - bookedSlots.length // Assuming 5 total slots
    });
  } catch (err) {
    console.error("Error checking availability:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// GET DATES WITH BOOKING COUNTS (PUBLIC - for disabling fully booked dates)
// -------------------------
router.post("/dates-availability", async (req, res) => {
  try {
    const { dates } = req.body; // Array of date strings
    
    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({ error: "dates array is required" });
    }
    
    const availability = {};
    
    for (const date of dates) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateObj);
      endOfDay.setHours(23, 59, 59, 999);
      
      const count = await StartupClinic.countDocuments({
        sessionDate: {
          $gte: dateObj,
          $lte: endOfDay
        }
      });
      
      availability[date] = {
        bookedCount: count,
        isFullyBooked: count >= 5 // 5 slots available per day
      };
    }
    
    res.status(200).json({ success: true, availability });
  } catch (err) {
    console.error("Error checking dates availability:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// BOOKING API (PUBLIC - Create new booking)
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
      sessionDate: normalizedDate,
      question1,
      question2,
      question3,
      subscribeNewsletter,
    });

    await newBooking.save();

    // -------------------------
    // ADD TO GOOGLE CALENDAR AUTOMATICALLY
    // -------------------------
    try {
      console.log('🔄 Automatically adding booking to Google Calendar...');
      const calendarEvent = await createCalendarEvent(newBooking);
      newBooking.calendarEventId = calendarEvent.id;
      await newBooking.save();
      console.log('✅ Successfully added to Google Calendar automatically');
      console.log('📅 Calendar Event ID:', calendarEvent.id);
      console.log('🔗 Event Link:', calendarEvent.htmlLink);
    } catch (calendarError) {
      console.error('⚠️ Failed to add to Google Calendar:', calendarError.message);
      // Continue anyway - booking is saved even if calendar fails
      // This ensures users still get their confirmation even if calendar API fails
    }

    // -------------------------
    // SEND CONFIRMATION EMAIL TO THE USER
    // -------------------------
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

// ===================================
// PROTECTED ROUTES (Admin only)
// ===================================

// -------------------------
// GET ALL BOOKINGS (PROTECTED - Admin route)
// -------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await StartupClinic.find().sort({ sessionDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// ADD TO GOOGLE CALENDAR (PROTECTED - Manual - Admin Dashboard)
// -------------------------
router.post("/:id/add-to-calendar", authMiddleware, async (req, res) => {
  try {
    console.log('📥 Received request to add booking to calendar:', req.params.id);
    console.log('👤 Admin:', req.user.email);
    
    const booking = await StartupClinic.findById(req.params.id);
    
    if (!booking) {
      console.log('❌ Booking not found');
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log('✅ Booking found:', {
      name: booking.name,
      email: booking.email,
      slot: booking.slot,
      sessionDate: booking.sessionDate
    });

    if (booking.calendarEventId) {
      console.log('⚠️ Booking already has calendar event ID');
      return res.status(400).json({ 
        success: false, 
        message: 'This booking is already in Google Calendar' 
      });
    }

    console.log('🔄 Attempting to create calendar event...');
    const calendarEvent = await createCalendarEvent(booking);
    
    booking.calendarEventId = calendarEvent.id;
    await booking.save();

    console.log('✅ Calendar event created and booking updated');
    
    res.json({ 
      success: true, 
      message: 'Successfully added to Google Calendar',
      eventId: calendarEvent.id,
      eventLink: calendarEvent.htmlLink
    });
  } catch (error) {
    console.error('❌ Error adding to calendar:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add to calendar: ' + error.message,
      error: error.message 
    });
  }
});

// -------------------------
// GET SINGLE BOOKING BY ID (PROTECTED)
// -------------------------
router.get("/:id", authMiddleware, async (req, res) => {
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
// DELETE BOOKING (PROTECTED)
// -------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
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