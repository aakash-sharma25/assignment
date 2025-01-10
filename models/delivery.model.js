const mongoose = require("mongoose");

const deliveryPersonnelSchema = new mongoose.Schema(
  {
    info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDeliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealBox",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryPerson", deliveryPersonnelSchema);
