const express = require("express");
const { check, body } = require('express-validator/check');

const bidController = require("../controllers/bid");
const bidSchema = require("../models/bid");
const router = express.Router();

router.post("/", [check('item')
				.exists()	
      			.withMessage('Please enter an item.'), 
      			check('amount')
      			.exists()
      			.withMessage('Please enter an amount.')], bidController.postBid);
router.get("/", bidController.getUserBids);

module.exports = router;
