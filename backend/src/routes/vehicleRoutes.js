import express from "express";
import { createVehicle,  getAllVehicles, getVehicleById, updateVehicle } from "../controllers/vehicleController.js";

const router = express.Router();


router.get("/", getAllVehicles);
router.post("/", createVehicle);

router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);


export default router;