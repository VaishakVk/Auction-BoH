const itemSchema = require('../models/items')
const authenticateUser = require('../util/authenticate')
const { validationResult } = require('express-validator/check');

exports.postItems = (req, res, next) => {
	// console.log(req.body) 
	if(!req.headers.authorization) {
		return res.status(401).json({message: "Please enter user credentials"})
	}
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log(errors.array())
   			return res.status(422).json({ errors: errors.array() });
  		}
	authenticateUser(req.headers.authorization, (authenticated, user) => {
		if(!authenticated) {
			return res.status(401).json({message: "Invalid User credentials"})
		}

		const name = req.body.name
		const itemDescription = req.body.itemDescription
		const startTime = req.body.startTime
		const endTime = req.body.endTime
		const startingAmount = req.body.startingAmount
		const winner = req.body.winner
		const imageURL = req.body.imageURL

		const item = new itemSchema({
			name: name,
			itemDescription: itemDescription,
			startTime: startTime,
			endTime: endTime,
			startingAmount: startingAmount,
			winner: winner,
			imageURL: imageURL
		})

		item.save()
		.then((response) => {
			return res.status(201).json({message: "Item created successfully"})
		})
		.catch((err) => {
			console.log(err)
			return res.status(500).json({message: "Error while creating item"})
		})

	})
	
}

exports.getItemDetails = (req, res, next) => {
	const item = req.params.item 
	const response = {}
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log(errors.array())
   			return res.status(422).json({ errors: errors.array() });
  		}
	itemSchema.findOne({name: item})
	.then(result => {
		if (!result) {
			return res.status(500).json({message: "Item does not exist"})
		}
		today = new Date()
		// console.log(today, result.startTime, today < result.startTime)
		// Currently in auction
		if (today < result.endTime && today > result.startTime) {
			delete result.winner
		}
		return res.json(result)
	})
	.catch(err => {
		return res.status(500).json({message: "Error while finding item"})
	})
}

exports.getItem = (req, res, next) => {
	const itemType = req.body.itemType
	var param_string
	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log(errors.array())
   			return res.status(422).json({ errors: errors.array() });
  		}
	const today = new Date()
	if(itemType == "ACTIVE") {
		param_string = {startTime: {$lte: today}, endTime: {$gte: today}}
	} else if(itemType == "PREVIOUS") {
		param_string = {endTime: {$lte: today}}
	} else if(itemType == "UPCOMING") {
		param_string = {startTime: {$gte: today}}
	}

	itemSchema.find(param_string)
	.then(result => {
		return res.status(200).json(result)
	})
	.catch(err => {
		return res.status(500).json({message: "Error while finding item"})	
	})
}