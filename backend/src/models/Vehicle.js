import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Truck",
        "Luxury",
        "Electric",
        "Sports",
      ],
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

   image: {
  type: String,
  default: "",
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);