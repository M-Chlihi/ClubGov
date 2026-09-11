const express = require("express");
const router = express.Router();

const validate = require("../../middleware/validation");
const { googleLoginSchema } = require("../../validation/authSchema");

const authcontroller = require("../../controllers/authController");

router
  .route("/")
  .post(validate(googleLoginSchema), authcontroller.loginWithGoogle);

module.exports = router;
