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


test("should not register user with existing email", async () => {
  const user = {
    name: "Abhay",
    email: "abhay@test.com",
    password: "123456",
  };

  await request(app).post("/api/auth/register").send(user);

  const response = await request(app)
    .post("/api/auth/register")
    .send(user);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("User already exists");
});



import User from "../models/User.js";

test("password should be hashed before saving", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Abhay",
    email: "hash@test.com",
    password: "123456",
  });

  const user = await User.findOne({
    email: "hash@test.com",
  });

  expect(user.password).not.toBe("123456");
});




test("should login user with valid credentials", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Abhay",
    email: "abhay@test.com",
    password: "123456",
  });

  const response = await request(app).post("/api/auth/login").send({
    email: "abhay@test.com",
    password: "123456",
  });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("token");
});




test("should not login with wrong password", async () => {
  await request(app).post("/api/auth/register").send({
    name: "Abhay",
    email: "wrong@test.com",
    password: "123456",
  });

  const response = await request(app).post("/api/auth/login").send({
    email: "wrong@test.com",
    password: "abcdef",
  });

  expect(response.statusCode).toBe(400);
});




test("should not login if user does not exist", async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "nouser@test.com",
    password: "123456",
  });

  expect(response.statusCode).toBe(400);
});