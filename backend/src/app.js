import express from "express";
// setup.js
import dotenv from "dotenv";

import cors from "cors";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


//auth api
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Car Dealership Inventory API is Running...",
  });
});

export default app;