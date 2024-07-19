const express = require("express");
const multer = require("multer");
const verfiyAuth = require("../middleware/verifyAuth");
const rolesAllowed = require("../middleware/roleBasedAuth");
const userModel = require("../models/userModels");
const { v4 } = require("uuid");
const router = express.Router();
const cloudinary = require("cloudinary");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    const newFilename = v4() + "." + file.mimetype.split("/")[1];
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

router.use(verfiyAuth);

router.use(rolesAllowed(["user"]));

router.get("/profile", async (req, res, next) => {
  try {
    const userDetails = await userModel.findById(
      req.userDetails.userId,
      "-password"
    );

    res.send(userDetails);
  } catch (error) {
    console.log(error);
    next();
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.put(
  "/profile-picture",
  upload.single("picture"),
  async (req, res, next) => {
    try {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "image",
        upload_preset: "kodecamp4",
      });

      await userModel.findByIdAndUpdate(req.userDetails.userId, {
        profilePictureURL: uploadResult.secure_url,
      });

      res.send({
        message: "Profile picture uploaded successfully",
        newProfilePictureURL: uploadResult.secure_url,
      });
    } catch (error) {
      console.log(error);
      next();
      res.status(500).send({
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
