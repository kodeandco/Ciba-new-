const mongoose = require("mongoose");

const StartupSubmissionSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, "Contact person is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  
  // Job Details
  jobTitle: {
    type: String,
    required: [true, "Job title is required"],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
    enum: ["Full-time", "Part-time", "Contract", "Internship"]
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
    trim: true
  },
  requirements: {
    type: String,
    required: [true, "Requirements are required"],
    trim: true
  },
  benefits: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("StartupSubmission", StartupSubmissionSchema);