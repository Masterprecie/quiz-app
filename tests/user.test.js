const app = require("../bin/www");
const mongoose = require("mongoose");

const request = require("supertest");
const activeQuizModel = require("../models/activeQuizModel");

beforeAll(async () => {
  await activeQuizModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

let userToken = "";
let questionOneId = "";
let questionTwoId = "";

describe("Testing the user routes", () => {
  test("Login the user", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "presh@gmail.com",
      password: "user",
    });
    userToken = response.body.token;
    expect(response.status).toBe(200);
  });

  test("Get question number 1", async () => {
    const response = await request(app)
      .get("/v1/user/quiz/1")
      .set("Authorization", `Bearer ${userToken}`);
    questionOneId = response.body.quiz._id;
    expect(response.status).toBe(200);
    // expect(response.body.quiz.questionNumber).toBe(1);
    expect(response.body.quiz.question).toBe("What is the capital of Nigeria?");
  });

  test("Answer question number 1", async () => {
    const response = await request(app)
      .post("/v1/user/answer-a-question")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quiz: questionOneId,
        optionChosen: "optionB",
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Answer submitted successfully");
  });

  test("Get question number 2", async () => {
    const response = await request(app)
      .get("/v1/user/quiz/2")
      .set("Authorization", `Bearer ${userToken}`);
    questionTwoId = response.body.quiz._id;
    expect(response.status).toBe(200);

    expect(response.body.quiz.question).toBe("What is the capital of Ghana?");
  });

  test("Answer question number 2", async () => {
    const response = await request(app)
      .post("/v1/user/answer-a-question")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        quiz: questionTwoId,
        optionChosen: "optionA",
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Answer submitted successfully");
  });

  test("Mark quiz", async () => {
    const response = await request(app)
      .post("/v1/user/mark-quiz")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.totalMarks).toBe(20);
    expect(response.body.totalAnsweredQuestions).toBe(2);
    expect(response.body.totalCorrectQuestions).toBe(2);
    expect(response.body.totalIncorrectQuestions).toBe(0);
  });
});
