const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const userModel = require("../models/userModels");

beforeAll(async () => {
  await userModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("This test will test for register and login for both user and admin", () => {
  test("Register a user", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "User Presh",
      email: "presh@gmail.com",
      password: "user",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  test("Register an admin", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      fullName: "Admin Presh",
      email: "adminpresh@gmail.com",
      password: "admin",
    });

    await userModel.findOneAndUpdate(
      { email: "adminpresh@gmail.com" },
      { role: "admin" }
    );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  test("login a user", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "presh@gmail.com",
      password: "user",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    expect(response.body.userDetails.role).toBe("user");
  });

  test("login an admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "adminpresh@gmail.com",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.userDetails).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    expect(response.body.userDetails.role).toBe("admin");
  });
});

// describe("", ()=>{})
