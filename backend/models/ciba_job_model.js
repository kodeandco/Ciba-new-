const mongoose = require("mongoose");

const CIBAJobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["job", "internship"],
    default: "job"
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  responsibilities: {
    type: String,
    trim: true,
    default: "",
  },
  requirements: {
    type: String,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  salary: {
    type: String,
    trim: true,
    default: "",
  },
  duration: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CIBAJob", CIBAJobSchema);