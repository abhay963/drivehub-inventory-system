import Vehicle from "../models/Vehicle.js";
import { askGroq } from "../services/groqService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Fetch all vehicles
    const vehicles = await Vehicle.find();

    // Send inventory to Groq
    const reply = await askGroq({
      message,
      inventory: vehicles,
    });

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};