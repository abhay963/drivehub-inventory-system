import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearDatabase,
} from "./setup.js";

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Vehicle API", () => {
  test("POST /api/vehicles should create a vehicle", async () => {
   const response = await request(app).post("/api/vehicles").send({
  brand: "Toyota",
  model: "Fortuner",
  category: "SUV",
  year: 2023,
  price: 4200000,
  quantity: 5,
});
    expect(response.statusCode).toBe(201);
  });
});




test("GET /api/vehicles should return all vehicles", async () => {
  await request(app).post("/api/vehicles").send({
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    year: 2023,
    price: 4200000,
    quantity: 5,
  });

  await request(app).post("/api/vehicles").send({
    brand: "Honda",
    model: "City",
    category: "Sedan",
    year: 2022,
    price: 1500000,
    quantity: 3,
  });

  const response = await request(app).get("/api/vehicles");

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(2);
});




test("GET /api/vehicles/:id should return a single vehicle", async () => {
  const createResponse = await request(app).post("/api/vehicles").send({
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    year: 2023,
    price: 4200000,
    quantity: 5,
  });

  const vehicleId = createResponse.body.vehicle._id;

  const response = await request(app).get(`/api/vehicles/${vehicleId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.brand).toBe("Toyota");
  expect(response.body.model).toBe("Fortuner");
});




test("PUT /api/vehicles/:id should update vehicle details", async () => {
  const createResponse = await request(app).post("/api/vehicles").send({
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    year: 2023,
    price: 4200000,
    quantity: 5,
  });

  const vehicleId = createResponse.body.vehicle._id;

  const response = await request(app)
    .put(`/api/vehicles/${vehicleId}`)
    .send({
      brand: "Toyota",
      model: "Fortuner Legender",
      category: "SUV",
      year: 2024,
      price: 4500000,
      quantity: 8,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.vehicle.model).toBe("Fortuner Legender");
  expect(response.body.vehicle.category).toBe("SUV");
  expect(response.body.vehicle.year).toBe(2024);
  expect(response.body.vehicle.price).toBe(4500000);
  expect(response.body.vehicle.quantity).toBe(8);
});




test("DELETE /api/vehicles/:id should delete vehicle", async () => {
  // Register Admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
  });

  // Make the registered user an admin
  await User.findOneAndUpdate(
    { email: "admin@test.com" },
    { role: "admin" }
  );

  // Login
  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "123456",
  });

  const token = loginResponse.body.token;

  // Create Vehicle
const createResponse = await request(app).post("/api/vehicles").send({
  brand: "Toyota",
  model: "Fortuner",
  category: "SUV",
  year: 2023,
  price: 4200000,
  quantity: 5,
});

  const vehicleId = createResponse.body.vehicle._id;

  // Delete Vehicle
  const response = await request(app)
    .delete(`/api/vehicles/${vehicleId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
});



test("GET /api/vehicles/search should filter vehicles", async () => {
  await request(app).post("/api/vehicles").send({
    brand: "Toyota",
    model: "Fortuner",
    category: "SUV",
    year: 2023,
    price: 4200000,
    quantity: 5,
  });

  await request(app).post("/api/vehicles").send({
    brand: "Honda",
    model: "City",
    category: "Sedan",
    year: 2022,
    price: 1500000,
    quantity: 3,
  });

  const response = await request(app)
    .get("/api/vehicles/search")
    .query({
      brand: "Toyota",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].brand).toBe("Toyota");
});