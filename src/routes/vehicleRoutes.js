import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehiclesByType,
  updateVehicle,
  deleteVehicle,
  updateVehicleAvailability,
  getAvailableVehicles,
} from "../controllers/vehicleController.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.js";
import {
  validateVehicle,
  handleValidationErrors,
} from "../middlewares/validation.js";

const router = Router();

// Public routes
router.get("/all", getAllVehicles);
router.get("/available", getAvailableVehicles);
router.get("/:id", getVehicleById);
router.get("/type/:type", getVehiclesByType);

// Admin protected routes
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  validateVehicle,
  handleValidationErrors,
  createVehicle
);
router.put("/:id", verifyJWT, verifyAdmin, updateVehicle);
router.delete("/:id", verifyJWT, verifyAdmin, deleteVehicle);
router.patch("/:id/availability", verifyJWT, verifyAdmin, updateVehicleAvailability);

export default router;
