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