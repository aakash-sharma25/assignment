const mongoose = require("mongoose");

const pantryStaffSchema = new mongoose.Schema(
  {
    info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTask: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DietChart",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PantryStaff", pantryStaffSchema);
