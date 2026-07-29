import express from "express";
import { register,  sendOtp,
  verifyOtp,
  login} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);

// Verify OTP & Register User
router.post("/verify-otp", verifyOtp);


export default router;