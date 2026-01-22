// ===================================
// File: middleware/authMiddleware.js
// Authentication middleware
// ===================================

const { verifyToken } = require("../utils/authUtils");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request
    const admin = await Admin.findById(decoded.id).select("-passwordHash");
    
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authMiddleware;
