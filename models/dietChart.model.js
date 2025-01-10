const mongoose = require("mongoose");

const dietChartSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    meals: {
      morning: {
        ingredients: { type: String, default: "" },
        instructions: { type: String, default: "" },
      },
      afternoon: {
        ingredients: { type: String, default: "" },
        instructions: { type: String, default: "" },
      },
      night: {
        ingredients: { type: String, default: "" },
        instructions: { type: String, default: "" },
      },
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

module.exports = mongoose.model("DietChart", dietChartSchema);
