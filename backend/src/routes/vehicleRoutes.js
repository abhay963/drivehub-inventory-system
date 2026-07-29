import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createVehicle,
  getAllVehicles,
  getInventorySummary,
  getVehicleById,
  updateVehicle,
  searchVehicles,
  purchaseVehicle,
  deleteVehicle,
  restockVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

const handleVehicleImageUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image must be 5MB or smaller.",
      });
    }

    if (
      err.http_code === 401 ||
      err.http_code === 403 ||
      err.name === "UnexpectedResponse"
    ) {
      return res.status(502).json({
        message:
          "Cloudinary rejected the upload. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.",
      });
    }

    return res.status(400).json({
      message: err.message || "Image upload failed.",
    });
  });
};

router.get("/search", searchVehicles);
router.get("/summary", getInventorySummary);

router.get("/", protect, getAllVehicles);

router.post(
  "/",
  protect,
  admin,
  handleVehicleImageUpload,
  createVehicle
);

router.put(
  "/:id",
  protect,
  admin,
  handleVehicleImageUpload,
  updateVehicle
);

router.get("/:id", getVehicleById);
router.delete("/:id", protect, admin, deleteVehicle);

router.post("/:id/purchase", protect, purchaseVehicle);

router.post("/:id/restock", protect, admin, restockVehicle);

export default router;
