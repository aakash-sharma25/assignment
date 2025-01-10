const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    diseases: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    roomDetails: {
      roomNumber: { type: Number, required: true },
      bedNumber: { type: Number, required: true },
    },
    contactInfo: {
      phone: { type: String, required: true },
      emergencyContact: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
