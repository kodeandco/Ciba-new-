const express = require("express");
const multer = require("multer");
const Newsletter = require("../models/newsletter_model");
const Subscriber = require("../models/subscriber_model");
const { sendNewsletterToAllSubscribers, sendWelcomeEmail } = require("../utils/emailService");

const router = express.Router();

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// ⚠️ CRITICAL: Specific routes MUST come BEFORE parameterized routes like /:id

// GET all newsletters (not just latest 2) - MUST BE BEFORE /:id
router.get("/all", async (req, res) => {
  console.log("📋 Getting ALL newsletters");
  
  try {
    const newsletters = await Newsletter.find({})
      .sort({ newsletterDate: -1 })
      .select("-file.data"); // exclude binary data for performance
    
    console.log(`✅ Found ${newsletters.length} newsletters`);
    res.json(newsletters);
  } catch (err) {
    console.error("❌ Error fetching all newsletters:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  console.log("📧 Newsletter subscription request");
  
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ error: "Email already subscribed" });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        console.log(`✅ Reactivated subscriber: ${email}`);
        await sendWelcomeEmail(email);
        return res.status(200).json({ message: "Successfully resubscribed!" });
      }
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();
    console.log(`✅ New subscriber: ${email}`);
    
    // Send welcome email
    await sendWelcomeEmail(email);

    res.status(200).json({ 
      message: "Successfully subscribed!",
      email: email 
    });
  } catch (err) {
    console.error("❌ Error subscribing:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET file by ID - MUST BE BEFORE /:id
router.get("/:id/file", async (req, res) => {
  console.log("📄 File route hit for ID:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      console.log("❌ Newsletter not found");
      return res.status(404).json({ error: "Newsletter not found" });
    }

    if (!newsletter.file || !newsletter.file.data) {
      console.log("❌ File not found for newsletter");
      return res.status(404).json({ error: "File not found" });
    }

    console.log("✅ Sending file:", newsletter.file.filename);

    res.set({
      "Content-Type": newsletter.file.contentType,
      "Content-Disposition": `inline; filename="${newsletter.file.filename}"`,
    });

    res.send(newsletter.file.data);

  } catch (err) {
    console.error("❌ Error fetching file:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET top 2 latest newsletters (root route)
router.get("/", async (req, res) => {
  console.log("📋 Getting latest 2 newsletters");
  
  try {
    const newsletters = await Newsletter.find({})
      .sort({ newsletterDate: -1 })
      .limit(2)
      .select("-file.data");
    
    console.log(`✅ Found ${newsletters.length} newsletters`);
    res.json(newsletters);
  } catch (err) {
    console.error("❌ Error fetching newsletters:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single newsletter by ID - MUST BE AFTER specific routes
router.get("/:id", async (req, res) => {
  console.log("📄 Getting newsletter by ID:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findById(req.params.id)
      .select("-file.data");
    
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    console.log("✅ Newsletter found:", newsletter.title);
    res.json(newsletter);
  } catch (err) {
    console.error("❌ Error fetching newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST new newsletter with file upload
router.post("/", upload.single("file"), async (req, res) => {
  console.log("📝 Creating new newsletter");
  
  try {
    const { title, description, newsletterDate, sendEmail } = req.body;

    if (!title || !description || !newsletterDate) {
      return res.status(400).json({ 
        error: "Missing required fields: title, description, or newsletterDate" 
      });
    }

    const newsletter = new Newsletter({
      title,
      description,
      newsletterDate: new Date(newsletterDate),
      file: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
        : undefined
    });

    await newsletter.save();
    console.log("✅ Newsletter created:", newsletter._id);

    // Send email to all subscribers if requested
    if (sendEmail === "true" || sendEmail === true) {
      console.log("📧 Sending newsletter to all subscribers...");
      
      const subscribers = await Subscriber.find({ isActive: true });
      
      if (subscribers.length > 0) {
        // ⚠️ CRITICAL: Fetch newsletter WITH file data for email attachment
        const newsletterWithFile = await Newsletter.findById(newsletter._id);
        
        // Send emails asynchronously (don't wait for completion)
        sendNewsletterToAllSubscribers(newsletterWithFile, subscribers)
          .then((results) => {
            console.log("✅ Email sending complete:", results);
          })
          .catch((error) => {
            console.error("❌ Email sending error:", error);
          });
        
        res.status(201).json({ 
          message: "Newsletter created and emails are being sent",
          id: newsletter._id,
          subscriberCount: subscribers.length
        });
      } else {
        res.status(201).json({ 
          message: "Newsletter created (no active subscribers)",
          id: newsletter._id
        });
      }
    } else {
      res.status(201).json({ 
        message: "Newsletter created successfully",
        id: newsletter._id 
      });
    }
  } catch (err) {
    console.error("❌ Error creating newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE newsletter by ID
router.delete("/:id", async (req, res) => {
  console.log("🗑️ Deleting newsletter:", req.params.id);
  
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    
    console.log("✅ Newsletter deleted");
    res.json({ message: "Newsletter deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting newsletter:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;