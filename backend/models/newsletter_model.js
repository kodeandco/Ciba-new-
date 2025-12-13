const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    file: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    newsletterDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
