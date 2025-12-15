// backend/models/graduated_startup_model.js
const mongoose = require("mongoose");

const GraduatedStartupSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
  },
  careerUrl: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GraduatedStartup", GraduatedStartupSchema);