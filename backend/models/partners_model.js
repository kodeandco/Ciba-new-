const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      data: Buffer,        // Image stored as binary
      contentType: String // image/png, image/jpeg etc.
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
