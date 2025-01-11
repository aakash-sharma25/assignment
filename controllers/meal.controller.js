const MealBox = require("../models/mealBox.model");
const Patient = require("../models/patient.model");
const DietChart = require("../models/dietChart.model");

exports.createMealBox = async (req, res) => {
  try {
    const { patientId, dietChartId, preparedBy } = req.body;

    // Validate required fields
    if (!patientId || !dietChartId || !preparedBy) {
      return res.status(400).json({
        success: false,
        message:
          "Patient ID, Diet Chart ID, and PreparedBy (Pantry Staff ID) are required",
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if diet chart exists
    const dietChart = await DietChart.findById(dietChartId);
    if (!dietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    // Check if pantry staff exists
    const pantryStaff = await PantryStaff.findById(preparedBy);
    if (!pantryStaff) {
      return res.status(404).json({
        success: false,
        message: "Pantry staff not found",
      });
    }

    // Create the meal box
    const mealBox = await MealBox.create({
      patientId,
      dietChartId,
      preparedBy,
      preparationStatus: "In Progress", // Set initial status
    });

    // Assign the meal box to the pantry staff
    pantryStaff.assignedMeal.push(mealBox._id);
    await pantryStaff.save();

    return res.status(201).json({
      success: true,
      message: "Meal box created and assigned to pantry staff successfully",
      mealBox,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating and assigning meal box",
      error: error.message,
    });
  }
};

exports.getAllDietChart = async (req, res) => {
  try {
    const dietCharts = await DietChart.find()
      .populate("patientId", "name roomDetails")
      .populate("preparedBy", "name")
      .populate("deliveredBy", "name");

    return res.status(200).json({
      success: true,
      message: "Diet charts retrieved successfully",
      dietCharts,
    });
  } catch (error) {
    console.error("Error fetching diet charts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching diet charts",
      error: error.message,
    });
  }
};


exports.getMealBoxById = async (req, res) => {
  try {
    const { id } = req.params;

    const mealBox = await MealBox.findById(id)
      .populate("patientId", "name roomNumber floorNumber")
      .populate("dietChartId", "meals")
      .populate("preparedBy", "name")
      .populate("deliveredBy", "name");

    if (!mealBox) {
      return res.status(404).json({
        success: false,
        message: "Meal box not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal box retrieved successfully",
      mealBox,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching meal box",
      error: error.message,
    });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { dietChartId, deliveryStatus } = req.body;

    // Validate input
    if (!dietChartId || !deliveryStatus) {
      return res.status(400).json({
        success: false,
        message: "Diet chart ID and delivery status are required",
      });
    }

    // Validate status enum
    const validDeliveryStatuses = ["Pending", "In Progress", "Delivered"];
    if (!validDeliveryStatuses.includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    // Update diet chart
    const updatedDietChart = await DietChart.findByIdAndUpdate(
      dietChartId,
      { deliveryStatus },
      { new: true }
    );

    if (!updatedDietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      dietChart: updatedDietChart,
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating delivery status",
      error: error.message,
    });
  }
};


exports.updatePreparationStatus = async (req, res) => {
  try {
    const { dietChartId, preparationStatus } = req.body;

    // Validate input
    if (!dietChartId || !preparationStatus) {
      return res.status(400).json({
        success: false,
        message: "Diet chart ID and preparation status are required",
      });
    }

    // Validate status enum
    const validPreparationStatuses = ["Not Started", "In Progress", "Prepared"];
    if (!validPreparationStatuses.includes(preparationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid preparation status",
      });
    }

    // Update diet chart
    const updatedDietChart = await DietChart.findByIdAndUpdate(
      dietChartId,
      { preparationStatus },
      { new: true }
    );

    if (!updatedDietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Preparation status updated successfully",
      dietChart: updatedDietChart,
    });
  } catch (error) {
    console.error("Error updating preparation status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating preparation status",
      error: error.message,
    });
  }
};



exports.assignDeliveryPersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveredBy } = req.body;

    if (!deliveredBy) {
      return res.status(400).json({
        success: false,
        message: "Delivery personnel ID is required",
      });
    }

    const mealBox = await MealBox.findByIdAndUpdate(
      id,
      { deliveredBy, deliveryStatus: "In Progress" },
      { new: true }
    );

    if (!mealBox) {
      return res.status(404).json({
        success: false,
        message: "Meal box not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery personnel assigned successfully",
      mealBox,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error assigning delivery personnel",
      error: error.message,
    });
  }
};


exports.deleteMealBox = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMealBox = await MealBox.findByIdAndDelete(id);

    if (!deletedMealBox) {
      return res.status(404).json({
        success: false,
        message: "Meal box not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal box deleted successfully",
      mealBox: deletedMealBox,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting meal box",
      error: error.message,
    });
  }
};
