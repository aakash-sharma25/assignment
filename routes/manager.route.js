const express = require("express");
const {
  addPatient,
  getAllPatients,
  getPatientById,
} = require("../controllers/patient.controller");
const {
  addDietChart,
  getAllDietCharts,
  getDietChartByPatientId,
} = require("../controllers/diet.controller");
const {
  addPantryStaff,
  getAllPantryStaff,
} = require("../controllers/pantry.controller");
const { isManager } = require("../middleware/role.middleware");

const router = express.Router();

router.get("/patients", getAllPatients);
router.post("/add-patient", addPatient);
router.get("/patient/:id", isManager, getPatientById);

router.post("/add-diet", addDietChart);
router.get("/diet/:patientId", getDietChartByPatientId);

router.post("/add-pantryStaff", addPantryStaff);
router.get("/all-pantryStaff", getAllPantryStaff);

router.get("/all-dietCharts", getAllDietCharts);

module.exports = router;
