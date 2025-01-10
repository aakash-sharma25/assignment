const mongoose = require("mongoose");

const mealBoxSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dietChartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietChart",
      required: true,
    },
    preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Delivered"],
      default: "Pending",
    },
    deliveryTimestamp: { type: Date },
    preparationStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Prepared"],
      default: "Not Started",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealBox", mealBoxSchema);
