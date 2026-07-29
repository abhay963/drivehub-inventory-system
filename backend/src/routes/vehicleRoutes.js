import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import { createVehicle,  getAllVehicles, getVehicleById, updateVehicle,searchVehicles, deleteVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/search", searchVehicles);
router.get("/", getAllVehicles);
router.post("/", createVehicle);

router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", protect, admin, deleteVehicle);


export default router;