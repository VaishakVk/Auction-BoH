const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bidSchema = new schema({
	item: {
		type: String,
		required: true
	},
	userId: {
		type: schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	amount: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model("Bid", bidSchema);