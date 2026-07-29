import express from "express";
// setup.js
import dotenv from "dotenv";

import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


//auth api
app.use("/api/auth", authRoutes);




//vehicle
app.use("/api/vehicles", vehicleRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Car Dealership Inventory API is Running...",
  });
});


app.use((err, req, res, next) => {
  console.error("🔥 EXPRESS ERROR");
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
});
export default app;