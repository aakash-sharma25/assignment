// const User = require("../models/User");
// const DeliveryPerson = require("../models/DeliveryPersonnel");

// exports.addDeliveryPersonnel = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       phone,
//       role,
//       assignedDeliveries,
//     } = req.body;

//     if (!firstName || !lastName || !email || !password || !phone || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required to create a delivery personnel user",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "A user with this email already exists",
//       });
//     }

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       phone,
//       role,
//     });

//     const deliveryPersonnel = await DeliveryPerson.create({
//       info: user._id,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Delivery personnel created successfully",
//       deliveryPersonnel,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating delivery personnel",
//       error: error.message,
//     });
//   }
// };

// exports.getAllDeliveryPersonnel = async (req, res) => {
//   try {
//     const deliveryPersonnelList = await DeliveryPerson.find()
//       .populate("info", "-password")
//       .populate("assignedDeliveries");

//     if (!deliveryPersonnelList.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No delivery personnel found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Delivery personnel retrieved successfully",
//       deliveryPersonnel: deliveryPersonnelList,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching delivery personnel",
//       error: error.message,
//     });
//   }
// };

// exports.getDeliveryPersonnelById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deliveryPersonnel = await DeliveryPerson.findById(id)
//       .populate("info", "-password")
//       .populate("assignedDeliveries");

//     if (!deliveryPersonnel) {
//       return res.status(404).json({
//         success: false,
//         message: "Delivery personnel not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Delivery personnel retrieved successfully",
//       deliveryPersonnel,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching delivery personnel",
//       error: error.message,
//     });
//   }
// };

// exports.updateDeliveryPersonnel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { assignedDeliveries } = req.body;

//     const deliveryPersonnel = await DeliveryPerson.findByIdAndUpdate(
//       id,
//       { assignedDeliveries },
//       { new: true }
//     ).populate("info", "-password");

//     if (!deliveryPersonnel) {
//       return res.status(404).json({
//         success: false,
//         message: "Delivery personnel not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Delivery personnel updated successfully",
//       deliveryPersonnel,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating delivery personnel",
//       error: error.message,
//     });
//   }
// };

// exports.deleteDeliveryPersonnel = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deliveryPersonnel = await DeliveryPerson.findById(id);
//     if (!deliveryPersonnel) {
//       return res.status(404).json({
//         success: false,
//         message: "Delivery personnel not found",
//       });
//     }

//     await User.findByIdAndDelete(deliveryPersonnel.info);

//     await DeliveryPerson.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       message: "Delivery personnel deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting delivery personnel",
//       error: error.message,
//     });
//   }
// };

const User = require("../models/user.model");
const DeliveryPerson = require("../models/delivery.model");
const MealBox = require("../models/mealBox.model");

// Add a new delivery personnel
exports.addDeliveryPersonnel = async (req, res) => {
  try {
    const { name, email, password, phone, role, assignedDeliveries } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create a delivery personnel user",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password, 
      phone,
      role,
    });

    const deliveryPersonnel = await DeliveryPerson.create({
      info: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Delivery personnel created successfully",
      deliveryPersonnel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating delivery personnel",
      error: error.message,
    });
  }
};

// Get all delivery personnel
exports.getAllDeliveryPersonnel = async (req, res) => {
  try {
    const deliveryPersonnelList = await DeliveryPerson.find()
      .populate("info", "-password") // Exclude password
      .populate("assignedDeliveries");

    if (!deliveryPersonnelList.length) {
      return res.status(404).json({
        success: false,
        message: "No delivery personnel found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery personnel retrieved successfully",
      deliveryPersonnel: deliveryPersonnelList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery personnel",
      error: error.message,
    });
  }
};

// Get a single delivery personnel by ID
exports.getDeliveryPersonnelById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryPersonnel = await DeliveryPerson.findById(id)
      .populate("info", "-password")
      .populate("assignedDeliveries");

    if (!deliveryPersonnel) {
      return res.status(404).json({
        success: false,
        message: "Delivery personnel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery personnel retrieved successfully",
      deliveryPersonnel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery personnel",
      error: error.message,
    });
  }
};

// Assign meal boxes to a delivery person
exports.assignMealBoxToDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId, mealBoxIds } = req.body;

    // Validate input
    if (!deliveryPersonId || !mealBoxIds || !mealBoxIds.length) {
      return res.status(400).json({
        success: false,
        message: "Delivery person ID and meal box IDs are required",
      });
    }

    // Find the delivery person
    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    // Update the meal boxes to assign them to the delivery person
    await MealBox.updateMany(
      { _id: { $in: mealBoxIds } },
      { deliveredBy: deliveryPersonId, deliveryStatus: "In Progress" }
    );

    // Update the delivery person's assigned deliveries
    deliveryPerson.assignedDeliveries.push(...mealBoxIds);
    await deliveryPerson.save();

    return res.status(200).json({
      success: true,
      message: "Meal boxes assigned to delivery person successfully",
      deliveryPerson,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error assigning meal boxes",
      error: error.message,
    });
  }
};

// Update a delivery personnel's assigned deliveries
exports.updateDeliveryPersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDeliveries } = req.body;

    const deliveryPersonnel = await DeliveryPerson.findByIdAndUpdate(
      id,
      { assignedDeliveries },
      { new: true }
    ).populate("info", "-password");

    if (!deliveryPersonnel) {
      return res.status(404).json({
        success: false,
        message: "Delivery personnel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery personnel updated successfully",
      deliveryPersonnel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating delivery personnel",
      error: error.message,
    });
  }
};

// Delete a delivery personnel
exports.deleteDeliveryPersonnel = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryPersonnel = await DeliveryPerson.findById(id);
    if (!deliveryPersonnel) {
      return res.status(404).json({
        success: false,
        message: "Delivery personnel not found",
      });
    }

    await User.findByIdAndDelete(deliveryPersonnel.info);
    await DeliveryPerson.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Delivery personnel deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting delivery personnel",
      error: error.message,
    });
  }
};

