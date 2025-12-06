// models/incubation_model.js
const mongoose = require("mongoose");

const IncubationSchema = new mongoose.Schema(
  {
    founderName: { type: String, required: true },
    coFounders: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    startupName: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { type: String, required: true },
    teamSize: { type: String, required: true },
    fundingRaised: { type: String, required: true },
    revenue: { type: String, required: true },
    website: { type: String, required: true },
    description: { type: String, required: true },
    
    // Store PDF as Buffer directly in MongoDB
    pitchDeck: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
      filename: { type: String, required: true },
      size: { type: Number, required: true },
    },
    
    status: { 
      type: String, 
      enum: ['pending', 'under_review', 'accepted', 'rejected'],
      default: 'pending'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incubation", IncubationSchema);