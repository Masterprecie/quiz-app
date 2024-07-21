const express = require("express");
const rolesAllowed = require("../middleware/roleBasedAuth");
const verfiyAuth = require("../middleware/verifyAuth");
const quizModel = require("../models/quizModel");
const router = express.Router();

router.use(verfiyAuth); //middleware to check if the user is authenticated

router.use(rolesAllowed(["admin"])); //middleware to check if the user is admin

//function to create quiz
router.post("/quiz", async (req, res, next) => {
  try {
    const {
      question,
      questionNumber,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    } = req.body;

    await quizModel.create({
      question,
      questionNumber,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    });

    res.status(201).send({
      message: "Quiz created successfully",
    });
  } catch (error) {
    next();
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

//function to get all quiz adding the pagination
router.get("/quiz/:page/:limit", async (req, res, next) => {
  try {
    const { page, limit } = req.params;

    const quizList = await quizModel.paginate({}, { page, limit });

    res.status(200).send({
      quizList,
    });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

//function to get quiz by id
router.get("/quiz-by-id/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await quizModel.findById(id);

    res.status(200).send({
      quiz,
    });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

//function to update quiz by id
router.put("/quiz/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      question,
      questionNumber,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    } = req.body;

    const updatedQuiz = await quizModel.findByIdAndUpdate(
      id,
      {
        question,
        questionNumber,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Quiz updated successfully",
      updatedQuiz,
    });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

// Function to delete quiz by id
router.delete("/quiz/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await quizModel.findByIdAndDelete(id);

    res.status(200).send({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

module.exports = router;
