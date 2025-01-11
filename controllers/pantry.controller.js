const User = require("../models/user.model");
const PantryStaff = require("../models/pantry.model");
const DietChart = require("../models/dietChart.model");
const mongoose = require("mongoose");

exports.addPantryStaff = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create a pantry staff user",
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

    const pantryStaff = await PantryStaff.create({
      info: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Pantry staff member created successfully",
      pantryStaff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating pantry staff",
      error: error.message,
    });
  }
};

exports.getAllPantryStaff = async (req, res) => {
  try {
    const pantryStaffList = await PantryStaff.find()
      .populate("info", "-password")
      .populate("assignedTask");

    return res.status(200).json({
      success: true,
      message: "Pantry staff members retrieved successfully",
      pantryStaff: pantryStaffList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching pantry staff members",
      error: error.message,
    });
  }
};

exports.getPantryStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const pantryStaff = await PantryStaff.findById(id)
      .populate("info", "-password")
      .populate("assignedTask");

    return res.status(200).json({
      success: true,
      message: "Pantry staff member retrieved successfully",
      pantryStaff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching pantry staff member",
      error: error.message,
    });
  }
};

exports.updatePantryStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedMeal } = req.body;

    const pantryStaff = await PantryStaff.findByIdAndUpdate(
      id,
      { assignedMeal },
      { new: true }
    ).populate("info", "-password");

    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: "Pantry staff member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pantry staff member updated successfully",
      pantryStaff,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating pantry staff",
      error: error.message,
    });
  }
};

exports.deletePantryStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const pantryStaff = await PantryStaff.findById(id);
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: "Pantry staff member not found",
      });
    }

    await User.findByIdAndDelete(pantryStaff.info);

    await PantryStaff.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Pantry staff member deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting pantry staff",
      error: error.message,
    });
  }
};

exports.assignPreparationStaff = async (req, res) => {
  try {
    const { dietChartId, preparedBy } = req.body;
    console.log(dietChartId, preparedBy);
    // Validate inputs
    if (!dietChartId || !preparedBy) {
      return res.status(400).json({
        success: false,
        message: "Diet chart ID and pantry staff ID are required",
      });
    }

    // Fetch the pantry staff
    const pantryStaff = await PantryStaff.findOne({ info: preparedBy });
    console.log(pantryStaff);
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: "Pantry staff not found",
      });
    }

    // Update the diet chart with the assigned preparation staff
    const updatedDietChart = await DietChart.findByIdAndUpdate(
      dietChartId,
      {
        preparedBy: preparedBy,
        preparationStatus: "In Progress",
      },
      { new: true }
    );

    if (!updatedDietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    // Add the diet chart to the staff's assigned tasks
    pantryStaff?.assignedTask?.push(dietChartId);
    await pantryStaff.save();

    res.status(200).json({
      success: true,
      message: "Preparation staff assigned successfully",
      updatedDietChart,
    });
  } catch (error) {
    console.error("Error assigning preparation staff:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning preparation staff",
      error: error.message,
    });
  }
};

exports.assignDeliveryStaff = async (req, res) => {
  try {
    const { dietChartId, deliveredBy } = req.body;
    console.log(dietChartId, deliveredBy);

    // Validate inputs
    if (!dietChartId || !deliveredBy) {
      return res.status(400).json({
        success: false,
        message: "Diet chart ID and pantry staff ID are required",
      });
    }

    const pantryStaff = await PantryStaff.findOne({ info: deliveredBy });
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: "Pantry staff not found",
      });
    }

    // Update the diet chart with the assigned delivery staff
    const updatedDietChart = await DietChart.findByIdAndUpdate(
      dietChartId,
      {
        deliveredBy: pantryStaff.info,
        deliveryStatus: "In Progress",
      },
      { new: true }
    );

    if (!updatedDietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    // Add the diet chart to the staff's assigned tasks
    pantryStaff.assignedTask.push(dietChartId);
    await pantryStaff.save();

    res.status(200).json({
      success: true,
      message: "Delivery staff assigned successfully",
      updatedDietChart,
    });
  } catch (error) {
    console.error("Error assigning delivery staff:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning delivery staff",
      error: error.message,
    });
  }
};
