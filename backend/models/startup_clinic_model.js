const mongoose = require("mongoose");

const StartupClinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    
    sessionDate: { type: Date, required: true }, // Add session date
    slot: { type: String, required: true }, // Remove unique: true from here
    
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    
    subscribeNewsletter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound unique index: same slot can't be booked twice on the same date
StartupClinicSchema.index({ sessionDate: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("StartupClinic", StartupClinicSchema);