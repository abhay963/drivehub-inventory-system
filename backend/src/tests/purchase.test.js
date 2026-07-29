import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import jwt from "jsonwebtoken";

let mongo;

let token;
let vehicle;
let user;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  await mongoose.connect(mongo.getUri());

  user = await User.create({
    name: "Abhay",
    email: "abhay@test.com",
    password: "hashedpassword",
  });

  token = jwt.sign(
    {
      id: user._id,
      role: "user",
    },
    process.env.JWT_SECRET
  );

  vehicle = await Vehicle.create({
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    year: 2024,
    price: 45000,
    quantity: 5,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Purchase Vehicle", () => {
  it("should create purchase history after purchasing vehicle", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const purchase = await Purchase.findOne({
      user: user._id,
    });

    expect(purchase).not.toBeNull();

    expect(purchase.vehicle.toString()).toBe(vehicle._id.toString());

    expect(purchase.quantity).toBe(1);

    expect(purchase.totalPrice).toBe(vehicle.price);
  });
});