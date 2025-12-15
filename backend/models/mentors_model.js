// models/mentors_model.js
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    designation: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    socialMedia: {
      linkedin: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true
      }
    },
    image: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);
