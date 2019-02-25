const userSchema = require('../models/user')
const bcrypt = require("bcrypt")

const authenticateUser = (header, callback) => {
	const authString = header.split(" ")[1];
	const creds = new Buffer.from(authString, 'base64').toString('ascii')
	const email = creds.split(":")[0]
	const password = creds.split(":")[1]
	userSchema.findOne({email: email})
		.then(user => {
			if(!user) {
				return callback(false, user)
			}
			bcrypt.compare(password, user.password)
			.then(success => {
				    return callback(true, user)
		    	})
		})
		.catch(err => {
			return callback(false, user)
		})
}

module.exports = authenticateUser