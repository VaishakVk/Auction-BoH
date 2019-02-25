const express = require("express");
const { check, body } = require('express-validator/check');

const itemController = require("../controllers/items");
const itemSchema = require("../models/items");
const router = express.Router();

router.get("/", [check('itemType')
				.exists()	
      			.withMessage('Please enter an item type - ACTIVE, PREVIOUS, UPCOMING.')], itemController.getItem);
router.post("/",[check('itemDescription')
				.exists()	
      			.withMessage('Please enter the item Description.'), 
      			check('name')
				.exists()	
      			.withMessage('Please enter the item name.'), 
      			check('startTime')
      			.exists()
      			.withMessage('Please enter the start Time.'),
      			check('endTime')
      			.exists()
      			.withMessage('Please enter the end Time.'),
      			check('startingAmount')
      			.exists()
      			.withMessage('Please enter the starting amount.')],  itemController.postItems);
router.get("/:item", [check('item')
				.exists()	
      			.withMessage('Please enter an item.')], itemController.getItemDetails);


module.exports = router;
