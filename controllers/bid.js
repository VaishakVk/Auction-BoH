const bidSchema = require('../models/bid')
const userSchema = require('../models/user')
const itemSchema = require('../models/items')
const authenticateUser = require('../util/authenticate')
const { validationResult } = require('express-validator/check');

exports.getUserBids = (req, res, next) => {
	if(!req.headers.authorization) {
		return res.status(401).json({message: "Please enter user credentials"})
	}

	authenticateUser(req.headers.authorization, (authenticated, user) => {
		if(!authenticated) {
			return res.status(401).json({message: "Invalid User credentials"})
		}
		// console.log(user)
		bidSchema.find({userId: user._id})
		.then(bidResult => {
			if (bidResult) {
				return res.status(200).json(bidResult)
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({message: "Error while finding bids"})
		})

	})
}

exports.postBid = (req, res, next) => {
	if(!req.headers.authorization) {
		return res.status(401).json({message: "Please enter user credentials"})
	}

	authenticateUser(req.headers.authorization, (authenticated, email_address) => {
		if(!authenticated) {
			return res.status(401).json({message: "Invalid User credentials"})
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// console.log(errors.array())
   			return res.status(422).json({ errors: errors.array() });
  		}

		const item = req.body.item
		const userId = email_address._id
		const amount = req.body.amount
		const today = new Date()

		itemSchema.findOne({name: item})
		.then(result => {
			if(!result) {
				return res.status(500).json({message: "Item not found"})
			}
			if (result.endTime < today ) {
				return res.status(400).json({message: "Bid cannot be placed for already auction completed item"})	
			} else if  (result.startTime > today ) {
				return res.status(400).json({message: "Bid cannot be placed for future item"})	
			} else if (result.startingAmount > amount) {
				return res.status(400).json({message: "Bid cannot be placed less than starting amount(" + result.startingAmount + ")"})	
			}
			// console.log(amount, result.winningAmount)
			if(amount > result.winningAmount) {
				result.winningAmount = amount
				result.winner = userId
				result.save()
			}

			const bid = new bidSchema({
				item: item,
				userId: userId,
				amount: amount
			})
			bid.save()
			.then((response) => {
				return res.status(201).json({message: "Bid created successfully"})
			})
			.catch((err) => {
				console.log(err)
				return res.status(500).json({message: "Error while creating bid"})
			})
		})
		.catch(err => {
			console.log(err)
			return res.status(500).json({message: "Error while finding item"})
		})
	})
}