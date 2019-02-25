const mongoose = require("mongoose")
const schema = mongoose.Schema

const itemSchema = new schema ({
	name: {
		type: String,
		required: true
	},
	itemDescription: {
		type: String,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		required: true
	},
	startingAmount: {
		type: Number,
		required: true
	},
	winner: {
		type: schema.Types.ObjectId,
		ref: 'User',
	},
	imageURL: {
		type: String
	},
	winningAmount: {
		type: Number,
		default: 0
	},
	emailSent: {
		type: String,
		default: 'N'
	}
})

module.exports = mongoose.model("Item", itemSchema);