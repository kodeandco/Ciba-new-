const mongoose = require("mongoose");

const StartupClinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    slot: { type: String, required: true, unique: true }, // prevent double booking

    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },

    subscribeNewsletter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StartupClinic", StartupClinicSchema);
