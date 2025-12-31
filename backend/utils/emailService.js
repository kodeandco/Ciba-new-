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

/**
 * Send incubation application status update email
 */
const sendIncubationStatusEmail = async (application, newStatus) => {
  const statusMessages = {
    under_review: {
      emoji: "🔍",
      title: "Application Under Review",
      message: "We're carefully reviewing your application and will get back to you soon with our decision.",
      color: "#3B82F6"
    },
    accepted: {
      emoji: "🎉",
      title: "Application Accepted - Congratulations!",
      message: "We're excited to inform you that your application has been accepted! Welcome to the CIBA Mumbai incubation program. Our team will contact you shortly with the next steps.",
      color: "#10B981"
    },
    rejected: {
      emoji: "📋",
      title: "Application Status Update",
      message: "Thank you for your interest in CIBA Mumbai's incubation program. After careful consideration, we are unable to move forward with your application at this time. We encourage you to apply again in the future as your startup evolves.",
      color: "#EF4444"
    }
  };

  const statusInfo = statusMessages[newStatus] || statusMessages.under_review;

  const mailOptions = {
    from: `CIBA Mumbai <${process.env.EMAIL_USER}>`,
    to: application.email,
    subject: `${statusInfo.emoji} ${statusInfo.title} - ${application.startupName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: ${statusInfo.color}; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 30px;">
              ${statusInfo.emoji}
            </div>
            <h1 style="color: #111827; margin: 0; font-size: 24px;">${statusInfo.title}</h1>
          </div>

          <!-- Greeting -->
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${application.founderName},
          </p>

          <!-- Main Message -->
          <div style="background-color: #f3f4f6; border-left: 4px solid ${statusInfo.color}; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #374151; margin: 0; line-height: 1.6;">
              ${statusInfo.message}
            </p>
          </div>

          <!-- Application Details -->
          <h3 style="color: #111827; margin-top: 25px; margin-bottom: 15px; font-size: 18px;">📋 Your Application Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Startup Name:</td>
              <td style="padding: 8px 0; color: #111827;">${application.startupName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Industry:</td>
              <td style="padding: 8px 0; color: #111827;">${application.industry}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Stage:</td>
              <td style="padding: 8px 0; color: #111827;">${application.stage}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Current Status:</td>
              <td style="padding: 8px 0; color: ${statusInfo.color}; font-weight: 700; text-transform: uppercase;">
                ${newStatus.replace("_", " ")}
              </td>
            </tr>
          </table>

          <!-- Additional Info for Accepted -->
          ${newStatus === 'accepted' ? `
            <div style="background-color: #D1FAE5; border-radius: 5px; padding: 15px; margin-top: 20px;">
              <h4 style="color: #065F46; margin-top: 0; margin-bottom: 10px;">🚀 Next Steps:</h4>
              <ul style="color: #065F46; margin: 0; padding-left: 20px;">
                <li>Our team will contact you within 2-3 business days</li>
                <li>Prepare your detailed business plan and financial projections</li>
                <li>Schedule an onboarding meeting</li>
              </ul>
            </div>
          ` : ''}

          <!-- Contact Information -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">
              📧 <strong>Email:</strong> ${application.email}
            </p>
            <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">
              📱 <strong>Phone:</strong> ${application.phone}
            </p>
            ${application.website ? `
              <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">
                🌐 <strong>Website:</strong> <a href="${application.website}" style="color: #3B82F6;">${application.website}</a>
              </p>
            ` : ''}
          </div>

          <!-- Closing -->
          <p style="color: #374151; margin-top: 25px; line-height: 1.6;">
            If you have any questions or need clarification, please don't hesitate to reach out to us.
          </p>

          <p style="color: #374151; margin-top: 15px;">
            Best regards,<br/>
            <strong>CIBA Mumbai Team</strong><br/>
            <span style="color: #6B7280; font-size: 14px;">Centre for Incubation and Business Acceleration</span>
          </p>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 5px 0;">
              This is an automated notification from CIBA Mumbai
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 5px 0;">
              CIBA Mumbai | Centre for Incubation and Business Acceleration
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Incubation status email sent to ${application.email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send status email to ${application.email}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNewsletterEmail,
  sendNewsletterToAllSubscribers,
  sendWelcomeEmail,
  sendIncubationStatusEmail,
};