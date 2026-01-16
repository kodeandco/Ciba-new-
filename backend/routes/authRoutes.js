// File: routes/authRoutes.js
// Authentication routes
// ===================================

const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const SetupToken = require("../models/SetupToken");
const ResetToken = require("../models/ResetToken");
const {
  hashPassword,
  verifyPassword,
  generateToken,
  generateSecureToken,
} = require("../utils/authUtils");
const {
  sendSetupEmail,
  sendPasswordResetEmail,
} = require("../utils/emailUtils");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/setup - Complete admin setup
router.post("/setup", async (req, res) => {
  try {
    const { email, password, setupToken } = req.body;

    // Validate input
    if (!email || !password || !setupToken) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    // Verify setup token
    const tokenDoc = await SetupToken.findOne({
      token: setupToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({
        error: "Invalid or expired setup token",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        error: "Admin account already exists",
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin account
    const admin = await Admin.create({
      email,
      passwordHash,
    });

    // Mark token as used
    tokenDoc.used = true;
    tokenDoc.usedAt = new Date();
    await tokenDoc.save();

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login - Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing email or password",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password is set
    if (!admin.passwordHash) {
      return res.status(401).json({
        error: "Admin account not fully set up",
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
    });

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/forgot-password - Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    // Always return success (don't reveal if email exists)
    if (!admin) {
      return res.json({
        success: true,
        message: "If an account exists, a reset email has been sent",
      });
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await ResetToken.create({
      email,
      token: resetToken,
      expiresAt,
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: "If an account exists, a reset email has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/reset-password - Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    // Verify reset token
    const tokenDoc = await ResetToken.findOne({
      token: resetToken,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update admin password
    await Admin.findOneAndUpdate(
      { email: tokenDoc.email },
      { passwordHash }
    );

    // Mark token as used
    tokenDoc.used = true;
    tokenDoc.usedAt = new Date();
    await tokenDoc.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/verify - Verify JWT token
router.get("/verify", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.user._id.toString(),
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me - Get current admin info (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.user._id.toString(),
        email: req.user.email,
        lastLoginAt: req.user.lastLoginAt,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get admin info error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout - Logout admin
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Optional: here you could add token blacklisting if needed
    // For now, just respond success
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
