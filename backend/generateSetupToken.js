// ===================================
// File: scripts/generateSetupToken.js
// Generate initial setup token script
// ===================================

require("dotenv").config();
const mongoose = require("mongoose");
const { generateSecureToken } = require("./utils/authUtils");
const SetupToken = require("./models/SetupToken");

const generateSetupToken = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await SetupToken.create({
      token,
      expiresAt,
    });

    console.log("\n=================================");
    console.log("Setup Token Generated Successfully");
    console.log("=================================");
    console.log(`Token: ${token}`);
    console.log(`Expires: ${expiresAt.toISOString()}`);
    console.log(
      `Setup URL: ${process.env.APP_URL}/admin/setup?setupToken=${token}`
    );
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error generating setup token:", error);
    process.exit(1);
  }
};

generateSetupToken();