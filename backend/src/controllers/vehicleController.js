import Vehicle from "../models/Vehicle.js";

export const createVehicle = async (req, res) => {
  try {
    const { brand, model, category, year, price, quantity } = req.body;

    const vehicle = await Vehicle.create({
      brand,
      model,
      category,
      year,
      price,
      quantity,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




