const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  positionId: {
    type: String,
    required: true,
  },
  positionTitle: {
    type: String,
    required: true,
  },
  positionType: {
    type: String,
    enum: ["ciba-job", "ciba-internship", "startup", "unknown"],
    default: "unknown",
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  resume: {
    data: Buffer,
    contentType: String,
    filename: String,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    default: "",
  },
  portfolio: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected"],  // ✅ Changed "accepted" to "shortlisted"
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);