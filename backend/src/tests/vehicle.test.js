import request from "supertest";
import app from "../app.js";

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