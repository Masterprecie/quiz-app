const express = require("express");
const quizModel = require("../models/quizModel");
const verfiyAuth = require("../middleware/verifyAuth");
const activeQuizModel = require("../models/activeQuizModel");
const quizHistoryModel = require("../models/quizHistoryModel");
const rolesAllowed = require("../middleware/roleBasedAuth");
const router = express.Router();

router.use(verfiyAuth);

router.use(rolesAllowed(["user"]));

router.get("/quiz/:questionNumber", async (req, res, next) => {
  try {
    const { questionNumber } = req.params;

    const quiz = await quizModel.findOne(
      { questionNumber },
      "-correctOption -createdAt -updatedAt "
    );
    res.json({ quiz });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.post("/answer-a-question", async (req, res, next) => {
  try {
    const { quiz, optionChosen } = req.body;

    const questionAlreadyAnswered = await activeQuizModel.findOne({
      quiz,
      user: req.userDetails.userId,
    });

    if (questionAlreadyAnswered) {
      res.status(400).send({
        message: "Question already answered",
      });
      return;
    }

    await activeQuizModel.create({
      quiz,
      optionChosen,
      user: req.userDetails.userId,
    });

    res.send({
      message: "Answer submitted successfully",
    });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.get("/unanswered-question-numbers", async (req, res, next) => {
  try {
    const answeredQuiz = await activeQuizModel
      .find({
        user: req.userDetails.userId,
      })
      .populate("quiz", "questionNumber");
    const answeredNumber = answeredQuiz.map((q) => q.quiz.questionNumber);
    const unansweredQuestions = [];

    for (let i = 1; i <= totalQuestions; i++) {
      if (!answeredNumber.includes(i)) {
        unansweredQuestions.push({
          questionNumber: i,
          state: "answered",
        });
      }
    }

    res.send({
      unansweredQuestions,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.post("/mark-quiz", async (req, res, next) => {
  try {
    const activeQuiz = await activeQuizModel
      .find({
        user: req.userDetails.userId,
      })
      .populate("quiz", "-questionNumber");

    let totalMarks = 0;
    let totalAnsweredQuestions = activeQuiz.length;
    let totalCorrectQuestions = 0;
    let totalIncorrectQuestions = 0;

    for (let question of activeQuiz) {
      if (question.quiz.correctOption == question.optionChosen) {
        totalMarks += 10;
        totalCorrectQuestions += 1;
      } else {
        totalIncorrectQuestions += 1;
      }
    }

    await quizHistoryModel.create({
      score: totalMarks,
      totalCorrectQuestions,
      totalIncorrectQuestions,
      questions: activeQuiz,
      user: req.userDetails.userId,
    });

    await activeQuizModel.deleteMany({
      user: req.userDetails.userId,
    });

    res.send({
      message: "Quiz marked successfully",
      totalMarks,
      totalAnsweredQuestions,
      totalCorrectQuestions,
      totalIncorrectQuestions,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.get("/quiz-history", async (req, res, next) => {
  try {
    const result = await quizHistoryModel.paginate({
      user: req.userDetails.userId,
    });

    // Manually remove fields from nested documents
    result.docs = result.docs.map((doc) => {
      doc.questions = doc.questions.map((question) => {
        delete question.createdAt;
        delete question.updatedAt;
        delete question.__v;
        return question;
      });
      return doc;
    });

    res.send({
      result,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.get("/quiz-history/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await quizHistoryModel.findById(id);

    res.send({ result });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

module.exports = router;
