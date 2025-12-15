const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  positionId: { type: String, required: true },
  positionTitle: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: {
    data: { type: Buffer, required: true }, // ✅ Binary data
    contentType: { type: String, required: true }, // ✅ MIME type
    filename: { type: String, required: true } // ✅ Original filename
  },
  coverLetter: { type: String, required: true },
  linkedIn: { type: String },
  portfolio: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);