const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const quizModel = require("../models/quizModel");

let adminToken = "";
let quizId = "";

beforeAll(async () => {
  await quizModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("Testing the admin routes", () => {
  test("Login the admin", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "adminpresh@gmail.com",
      password: "admin",
    });

    adminToken = response.body.token;
    expect(response.status).toBe(200);
  });

  test("Add a quiz", async () => {
    const response = await request(app)
      .post("/v1/admin/quiz")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        question: "What is the capital of Nigeria?",
        questionNumber: 1,
        optionA: "Lagos",
        optionB: "Abuja",
        optionC: "Kano",
        optionD: "Ibadan",
        correctOption: "optionB",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Quiz created successfully");
  });

  test("Add a second quiz", async () => {
    const response = await request(app)
      .post("/v1/admin/quiz")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        question: "What is the capital of Ghana?",
        questionNumber: 2,
        optionA: "Accra",
        optionB: "Kumasi",
        optionC: "Tamale",
        optionD: "Ho",
        correctOption: "optionA",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Quiz created successfully");
  });

  test("Get a list of quiz", async () => {
    const response = await request(app)
      .get("/v1/admin/quiz/1/10")
      .set("Authorization", `Bearer ${adminToken}`);

    quizId = response.body.quizList.docs[0]._id;

    expect(response.status).toBe(200);
    expect(typeof response.body.quizList).toBe("object");
  });

  test("Get a quiz by ID", async () => {
    const response = await request(app)
      .get(`/v1/admin/quiz-by-id/${quizId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.quiz.question).toBe("What is the capital of Nigeria?");
  });
});
