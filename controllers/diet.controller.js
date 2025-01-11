const DietChart = require("../models/dietChart.model"); 
const Patient = require("../models/patient.model"); 

exports.addDietChart = async (req, res) => {
  try {
    const { patientId, meals } = req.body;

    if (!patientId || !meals) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and meals are required",
      });
    }

    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    
    const dietChart = await DietChart.create({
      patientId,
      meals, 
    });

    return res.status(201).json({
      success: true,
      message: "Diet chart added successfully",
      dietChart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding diet chart",
      error: error.message,
    });
  }
};

exports.getAllDietCharts = async (req, res) => {
  try {
    const dietCharts = await DietChart.find()
      .populate("patientId", "name roomDetails")
      .populate("deliveredBy", "name")
      .populate("preparedBy", "name");

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

exports.getDietChartByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const dietChart = await DietChart.findOne({ patientId }).populate(
      "patientId",
      "name roomNumber"
    );

    return res.status(200).json({
      success: true,
      message: "Diet chart retrieved successfully",
      dietChart,
    });
        
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching diet chart",
      error: error.message,
    });
  }
};

exports.updateDietChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { meals } = req.body;

    if (!meals) {
      return res.status(400).json({
        success: false,
        message: "Meals information is required to update",
      });
    }

    const updatedDietChart = await DietChart.findByIdAndUpdate(
      id,
      { meals },
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
      message: "Diet chart updated successfully",
      dietChart: updatedDietChart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating diet chart",
      error: error.message,
    });
  }
};

exports.deleteDietChart = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDietChart = await DietChart.findByIdAndDelete(id);

    if (!deletedDietChart) {
      return res.status(404).json({
        success: false,
        message: "Diet chart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Diet chart deleted successfully",
      dietChart: deletedDietChart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting diet chart",
      error: error.message,
    });
  }
};

// Assign specific instructions to meals (e.g., "no salt", "low sugar")
// exports.addMealInstructions = async (req, res) => {
//   try {
//     const { id } = req.params; // Diet chart ID
//     const { mealType, instructions } = req.body;

//     if (!mealType || !instructions) {
//       return res.status(400).json({
//         success: false,
//         message: "Meal type and instructions are required",
//       });
//     }

//     const dietChart = await DietChart.findById(id);
//     if (!dietChart) {
//       return res.status(404).json({
//         success: false,
//         message: "Diet chart not found",
//       });
//     }

//     // Add instructions to the specified meal
//     dietChart.meals[mealType].instructions = instructions;
//     await dietChart.save();

//     return res.status(200).json({
//       success: true,
//       message: "Meal instructions updated successfully",
//       dietChart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating meal instructions",
//       error: error.message,
//     });
//   }
// };
