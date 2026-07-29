import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import { createVehicle,  getAllVehicles,getInventorySummary, getVehicleById, updateVehicle,searchVehicles, purchaseVehicle,deleteVehicle,restockVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/search", searchVehicles);
router.get("/summary", getInventorySummary);

router.get("/", protect, getAllVehicles);

router.post("/", protect, admin, createVehicle);

router.get("/:id", getVehicleById);

router.put("/:id", protect, admin, updateVehicle);

router.delete("/:id", protect, admin, deleteVehicle);

router.post("/:id/purchase", protect, purchaseVehicle);

router.post("/:id/restock", protect, admin, restockVehicle);
export default router;