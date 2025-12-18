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
      data: Buffer,
      contentType: String,
      filename: String,
    },
    aspectRatio: {
      type: String,
      enum: ["9:16", "16:9"],
      default: "16:9",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Gallery", GallerySchema);