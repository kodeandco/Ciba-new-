// ===================================
// File: utils/emailUtils.js
// Email utilities
// ===================================

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendSetupEmail = async (email, token) => {
  const setupUrl = `${process.env.APP_URL}/admin/setup?setupToken=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Admin Account Setup",
    html: `
      <h2>Admin Account Setup</h2>
      <p>Click the link below to complete your admin account setup:</p>
      <a href="${setupUrl}">${setupUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.APP_URL}/admin/reset-password?resetToken=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

module.exports = {
  sendSetupEmail,
  sendPasswordResetEmail,
};