import request from "supertest";
import app from "../app.js";

import {
  connectTestDB,
  disconnectTestDB,
  clearDatabase,
} from "./setup.js";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Auth API", () => {
  test("POST /api/auth/register should register a user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Abhay",
      email: "abhay@test.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });
});