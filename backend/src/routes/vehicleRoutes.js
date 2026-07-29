import express from "express";
import { createVehicle,  getAllVehicles, getVehicleById } from "../controllers/vehicleController.js";

const router = express.Router();


router.get("/", getAllVehicles);
router.post("/", createVehicle);

router.get("/:id", getVehicleById);

export default router;