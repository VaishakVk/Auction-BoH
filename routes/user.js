const express = require("express");
const { check, body } = require('express-validator/check');

const userController = require("../controllers/user");
const userSchema = require("../models/user");
const router = express.Router();

router.post("/", [check('email')
				.exists()	
      			.withMessage('Please enter the email.'), 
      			check('password')
      			.exists()
      			.withMessage('Please enter the password.'),
      			check('fullName')
      			.exists()
      			.withMessage('Please enter the full name.')], userController.postUser);

module.exports = router;
