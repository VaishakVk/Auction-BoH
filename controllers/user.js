const userSchema = require('../models/user')
const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator/check');

exports.postUser = (req, res, next) => {
	const email = req.body.email
	const password = req.body.password
	const fullName = req.body.fullName

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// console.log(errors.array())
			return res.status(422).json({ errors: errors.array() });
	}

	userSchema.findOne({email: email})
	.then(user => {
		if(user) {
			return res.status(401).json({message: "User already exists"})
		}
		bcrypt.hash(password, 10)
		.then(hash => {
			    const userAdd = new userSchema({
				    email: email,
				    password: hash,
				    fullName: fullName
	    		});
		
			return userAdd.save()
		})
		.then(result => {
			return res.status(201).json({message: "User created successfully"})
		})
		.catch(err => {
			console.log(err)
			return res.status(500).json({message: "Error while creating user"})
		})
	})
	.catch(err => {
		console.log(err)
		return res.status(500).json({message: "Error while creating user"})
	})	
	
}