import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

import app from "../app.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";

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
    phone: "9876543210",
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

afterEach(async () => {
  await Purchase.deleteMany();

  await Vehicle.findByIdAndUpdate(vehicle._id, {
    quantity: 5,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Purchase Vehicle API", () => {
  test("should purchase vehicle successfully", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe(
      "Vehicle purchased successfully"
    );

    const purchase = await Purchase.findOne({
      user: user._id,
    });

    expect(purchase).not.toBeNull();
    expect(purchase.vehicle.toString()).toBe(
      vehicle._id.toString()
    );
    expect(purchase.quantity).toBe(1);
    expect(purchase.price).toBe(45000);
    expect(purchase.totalPrice).toBe(45000);

    const updatedVehicle = await Vehicle.findById(vehicle._id);

    expect(updatedVehicle.quantity).toBe(4);
  });

  test("should purchase multiple vehicles", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 3,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.purchase.quantity).toBe(3);
    expect(response.body.purchase.totalPrice).toBe(135000);

    const updatedVehicle = await Vehicle.findById(vehicle._id);

    expect(updatedVehicle.quantity).toBe(2);
  });

  test("should not purchase if quantity is zero", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid quantity");
  });

  test("should not purchase if quantity is negative", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: -2,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid quantity");
  });

  test("should not purchase if quantity is not a number", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: "abc",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid quantity");
  });

  test("should not purchase if stock is insufficient", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 10,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Insufficient stock");
  });

  test("should return 404 if vehicle does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/vehicles/${fakeId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Vehicle not found");
  });

  test("should not allow purchase without token", async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .send({
        quantity: 1,
      });

    expect(response.statusCode).toBe(401);
  });
});

describe("Purchase History API", () => {
  test("should return purchase history of logged in user", async () => {
    await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
      });

    const response = await request(app)
      .get("/api/vehicles/purchases")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body).toHaveLength(1);

    expect(response.body[0].quantity).toBe(2);

    expect(response.body[0].price).toBe(45000);

    expect(response.body[0].totalPrice).toBe(90000);

    expect(response.body[0].paymentStatus).toBe("Paid");

    expect(response.body[0].deliveryStatus).toBe("Processing");

    expect(response.body[0].vehicle.brand).toBe("Toyota");

    expect(response.body[0].vehicle.model).toBe("Fortuner");
  });

  test("should return empty purchase history", async () => {
    const response = await request(app)
      .get("/api/vehicles/purchases")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual([]);
  });
});




describe("Admin Purchase History API", () => {
  let admin;
  let adminToken;

  beforeAll(async () => {
    admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      phone: "9999999999",
      password: "hashedpassword",
      role: "admin",
    });

    adminToken = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET
    );
  });

  test("should return all purchases with populated user and vehicle", async () => {
    await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
      });

    const response = await request(app)
      .get("/api/vehicles/all-purchases")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveLength(1);

    expect(response.body[0].user.name).toBe("Abhay");

    expect(response.body[0].user.email).toBe("abhay@test.com");

    expect(response.body[0].vehicle.brand).toBe("Toyota");

    expect(response.body[0].vehicle.model).toBe("Fortuner");

    expect(response.body[0].quantity).toBe(2);

    expect(response.body[0].totalPrice).toBe(90000);
  });

  test("should deny normal user access", async () => {
    const response = await request(app)
      .get("/api/vehicles/all-purchases")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
  });

  test("should require authentication", async () => {
    const response = await request(app).get(
      "/api/vehicles/all-purchases"
    );

    expect(response.statusCode).toBe(401);
  });

  test("should return latest purchases first", async () => {
  await request(app)
    .post(`/api/vehicles/${vehicle._id}/purchase`)
    .set("Authorization", `Bearer ${token}`)
    .send({ quantity: 1 });

  await new Promise((r) => setTimeout(r, 10));

  await request(app)
    .post(`/api/vehicles/${vehicle._id}/purchase`)
    .set("Authorization", `Bearer ${token}`)
    .send({ quantity: 2 });

  const response = await request(app)
    .get("/api/vehicles/all-purchases")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveLength(2);

  expect(response.body[0].quantity).toBe(2);
  expect(response.body[1].quantity).toBe(1);
});
});

