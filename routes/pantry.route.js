const express = require("express");
const {
  getAllDeliveryPersonnel,
  addDeliveryPersonnel,
} = require("../controllers/delivery.controller");

const {
  updatePreparationStatus,
  updateDeliveryStatus,
} = require("../controllers/meal.controller");
const {
  assignDeliveryStaff,
  assignPreparationStaff,
} = require("../controllers/pantry.controller");
const { isManager } = require("../middleware/role.middleware");

const router = express.Router();

router.get("/delivery", getAllDeliveryPersonnel);
router.post("/add-delivery", addDeliveryPersonnel);

router.patch("/assign-delivery", isManager, assignDeliveryStaff);
router.patch("/assign-preparation", isManager, assignPreparationStaff);

router.patch("/update-preparation-status", updatePreparationStatus);
router.patch("/update-delivery-status", updateDeliveryStatus);

module.exports = router;
