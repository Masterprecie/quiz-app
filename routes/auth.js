const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userDetails = await userModel.findOne({ email });

    if (!userDetails) {
      res.status(404).send({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, userDetails.password);

    if (!isPasswordValid) {
      res.status(401).send({
        message: "Invalid Credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: userDetails._id,
        fullName: userDetails.fullName,
        email: userDetails.email,
        role: userDetails.role,
      },
      process.env.AUTH_SECRET
    );

    res.status(200).send({
      message: "Login successful",
      token,
      userDetails: {
        fullName: userDetails.fullName,
        email: userDetails.email,
        role: userDetails.role,
      },
    });
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});
module.exports = router;
