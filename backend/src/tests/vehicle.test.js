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
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";

let adminToken;

beforeEach(async () => {
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    phone: "9876543210",
    password: "123456",
  });
  await User.findOneAndUpdate(
    { email: "admin@test.com" },
    { role: "admin" }
  );
  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@test.com",
      password: "123456",
    });
  adminToken = login.body.token;
});

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
    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 4200000,
        quantity: 5,
      });
    expect(response.statusCode).toBe(201);
  });

  test("GET /api/vehicles should return all vehicles", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 4200000,
        quantity: 5,
      });
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2022,
        price: 1500000,
        quantity: 3,
      });
    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("GET /api/vehicles/:id should return a single vehicle", async () => {
    const createResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
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
    const createResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
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
      .set("Authorization", `Bearer ${adminToken}`)
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
    // Create Vehicle
    const createResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
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
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /api/vehicles/search should filter vehicles", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 4200000,
        quantity: 5,
      });
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
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

  test("POST /api/vehicles/:id/purchase should purchase a vehicle", async () => {
    // Register User
    await request(app).post("/api/auth/register").send({
      name: "Abhay",
      email: "user@test.com",
      phone: "9999999999",
      password: "123456",
    });
    // Login
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "123456",
    });
    const token = loginResponse.body.token;
    const createResponse = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 4200000,
        quantity: 5,
      });
    const vehicleId = createResponse.body.vehicle._id;
    // Purchase
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.vehicle.quantity).toBe(4);
  });

  test("GET /api/vehicles/summary should return inventory summary", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 4200000,
        quantity: 5,
      });
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2022,
        price: 1500000,
        quantity: 3,
      });
    const response = await request(app).get("/api/vehicles/summary");
    expect(response.statusCode).toBe(200);
    expect(response.body.totalVehicles).toBe(2);
    expect(response.body.totalStock).toBe(8);
    expect(response.body.totalInventoryValue).toBe(
      4200000 * 5 + 1500000 * 3
    );
  });
});