const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  jobRole: { type: String, required: true },
  resumeUrl: { type: String },        // if you're uploading resumes
  coverLetter: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
