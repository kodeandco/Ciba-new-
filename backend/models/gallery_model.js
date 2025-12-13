const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      data: Buffer,              // Binary image data
      contentType: String,       // image/jpeg, image/png, etc.
      filename: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,         // current date & time
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Gallery", GallerySchema);
