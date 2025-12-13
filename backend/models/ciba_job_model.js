// backend/models/ciba_job_model.js
const mongoose = require("mongoose");

const CIBAJobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    default: "Full-time",
    enum: ["Full-time", "Part-time", "Internship"],
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CIBAJob", CIBAJobSchema);