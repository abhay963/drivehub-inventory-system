import Vehicle from "../models/Vehicle.js";

import Purchase from "../models/Purchase.js";


export const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      category,
      year,
      price,
      quantity,
    } = req.body;

    const vehicle = await Vehicle.create({
      brand,
      model,
      category,
      year,
      price,
      quantity,
      image: req.file?.path || "",
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
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

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // If a new image is uploaded
    if (req.file) {
      vehicle.image = req.file.path;
    }

    vehicle.brand = req.body.brand ?? vehicle.brand;
    vehicle.model = req.body.model ?? vehicle.model;
    vehicle.category = req.body.category ?? vehicle.category;
    vehicle.year = req.body.year ?? vehicle.year;
    vehicle.price = req.body.price ?? vehicle.price;
    vehicle.quantity = req.body.quantity ?? vehicle.quantity;

    await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchVehicles = async (req, res) => {
  try {
    const { brand, model, year } = req.query;

    const filter = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (year) filter.year = Number(year);

    const vehicles = await Vehicle.find(filter);

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




export const purchaseVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({
        message: "Vehicle out of stock",
      });
    }

    vehicle.quantity -= 1;

    await vehicle.save();

    const purchase = await Purchase.create({
      user: req.user.id,
      vehicle: vehicle._id,
      quantity: 1,
      totalPrice: vehicle.price,
    });

    res.status(200).json({
      message: "Vehicle purchased successfully",
      vehicle,
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    const totalVehicles = vehicles.length;

    const totalStock = vehicles.reduce(
      (sum, vehicle) => sum + vehicle.quantity,
      0
    );

    const totalInventoryValue = vehicles.reduce(
      (sum, vehicle) => sum + vehicle.price * vehicle.quantity,
      0
    );

    res.status(200).json({
      totalVehicles,
      totalStock,
      totalInventoryValue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




export const restockVehicle = async (req, res) => {
  try {
    const { quantity } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const change = Number(quantity);

    if (!Number.isInteger(change) || change === 0) {
      return res.status(400).json({
        message: "Quantity must be a non-zero integer",
      });
    }

    if (vehicle.quantity + change < 0) {
      return res.status(400).json({
        message: "Insufficient stock. Cannot reduce below 0.",
      });
    }

    vehicle.quantity += change;

    await vehicle.save();

    res.status(200).json({
      message:
        change > 0
          ? "Vehicle restocked successfully"
          : "Vehicle stock reduced successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
