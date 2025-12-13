// utils/emailService.js
const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password, not regular password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

/**
 * Send newsletter to a single subscriber with PDF attached
 */
const sendNewsletterEmail = async (subscriberEmail, newsletter) => {
  const mailOptions = {
    from: `CIBA Mumbai <${process.env.EMAIL_USER}>`,
    to: subscriberEmail,
    subject: `📰 New Newsletter: ${newsletter.title}`,
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>📰 New Newsletter Available!</h2>
        
        <h3>Newsletter Information:</h3>
        <p><strong>Title:</strong> ${newsletter.title}</p>
        <p><strong>Published:</strong> ${new Date(newsletter.newsletterDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</p>
        
        <h3>Description:</h3>
        <p>${newsletter.description}</p>

        <h3>📎 Attached Documents:</h3>
        <p>Newsletter PDF is attached to this email for your review.</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>CIBA Mumbai Team</strong></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          You're receiving this because you subscribed to CIBA Mumbai newsletters.<br/>
          CIBA Mumbai | Centre for Incubation and Business Acceleration
        </p>
      </div>
    `,
    attachments: [
      {
        filename: newsletter.file.filename || `${newsletter.title}.pdf`,
        content: newsletter.file.data,
        contentType: newsletter.file.contentType || 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${subscriberEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${subscriberEmail}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send newsletter to all active subscribers
 */
const sendNewsletterToAllSubscribers = async (newsletter, subscribers) => {
  console.log(`📧 Sending newsletter to ${subscribers.length} subscribers...`);
  
  const results = {
    total: subscribers.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // Send emails with delay to avoid rate limiting
  for (const subscriber of subscribers) {
    if (!subscriber.isActive) continue;

    const result = await sendNewsletterEmail(subscriber.email, newsletter);
    
    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      results.errors.push({ email: subscriber.email, error: result.error });
    }

    // Add delay between emails (100ms) to avoid Gmail rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`✅ Newsletter sent: ${results.sent} successful, ${results.failed} failed`);
  return results;
};

/**
 * Send welcome email to new subscriber
 */
const sendWelcomeEmail = async (subscriberEmail) => {
  const mailOptions = {
    from: `CIBA Mumbai <${process.env.EMAIL_USER}>`,
    to: subscriberEmail,
    subject: "✅ Welcome to CIBA Mumbai Newsletter!",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>🎉 Welcome to CIBA Mumbai!</h2>
        <p>Hi there,</p>

        <p>Thank you for subscribing to the CIBA Mumbai Newsletter!</p>
        
        <h3>What to Expect:</h3>
        <p>You'll now receive our latest newsletters with insights, news, and opportunities from CIBA Mumbai directly in your inbox.</p>
        <p>Each newsletter will be sent to you as a PDF attachment that you can easily open and read.</p>

        <p>Stay tuned for updates!</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>CIBA Mumbai Team</strong></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          CIBA Mumbai | Centre for Incubation and Business Acceleration
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${subscriberEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${subscriberEmail}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNewsletterEmail,
  sendNewsletterToAllSubscribers,
  sendWelcomeEmail,
};