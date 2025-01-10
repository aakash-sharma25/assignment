const Patient = require("../models/patient.model");

exports.addPatient = async (req, res) => {
  try {
    const {
      name,
      diseases,
      allergies,
      roomNumber,
      bedNumber,
      age,
      gender,
      phone,
      secondaryPhone,
      notes,
    } = req.body;

    if (!name || !age || !gender || !roomNumber || !bedNumber || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Age, Gender, Room, Bed No,phone, are required",
      });
    }

    const patient = await Patient.create({
      name,
      diseases: diseases || [],
      allergies: allergies || [],
      roomDetails: {
        roomNumber,
        bedNumber,
      },
      age,
      gender,
      contactInfo: {
        phone: phone,
        emergencyContact: secondaryPhone,
      },
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Patient added successfully",
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding patient",
      error: error.message,
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    // if (!patients.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No patients found",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "Patients retrieved successfully",
      patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient details",
      error: error.message,
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating patient",
      error: error.message,
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    await Patient.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting patient",
      error: error.message,
    });
  }
};

// exports.getPatientsByRoomOrFloor = async (req, res) => {
//   try {
//     const { roomNumber, floorNumber } = req.query;

//     const query = {};
//     if (roomNumber) query.roomNumber = roomNumber;
//     if (floorNumber) query.floorNumber = floorNumber;

//     const patients = await Patient.find(query);

//     if (!patients.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No patients found for the given room or floor",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Patients retrieved successfully",
//       patients,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching patients",
//       error: error.message,
//     });
//   }
// };
