import express from "express";
import { createVehicle,  getAllVehicles } from "../controllers/vehicleController.js";

const router = express.Router();


router.get("/", getAllVehicles);
router.post("/", createVehicle);

export default router;