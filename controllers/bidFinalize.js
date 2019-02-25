const nodemailer = require('nodemailer');
const moment = require('moment');

const bidSchema = require('../models/bid')
const userSchema = require('../models/user')
const itemSchema = require('../models/items')


var bidItem = ''
var winningAmount = ''
var winnerId = ''
var toAddress = []

module.exports = ()=> {
	require('dotenv').config();

	const today = new Date()
	// const todayUtc = moment.utc(today)
	// const localTime = moment(todayUtc).local()
	// console.log(today)
	itemSchema 
	.find({emailSent: 'N', endTime: {$lt: today}})
	.populate('winner')
	.exec()
	.then((pendingItems) => {
		
		pendingItems.forEach((bid) => {
			toAddress = []
			// console.log(pendingItems)
			if (bid.winner) {
				bidItem = bid.name
				winner = bid.winner.fullName
				winningAmount = bid.winningAmount
				// console.log(bid)
				bidSchema
				.find({item: bid.name})
				.populate('userId')
				.exec()
				.then((bidDetails) => {				
					toAddress = bidDetails.map(value => value.userId.email);
					// console.log(toAddress)
					if (toAddress) {
						toAddress = toAddress.join(',')
						var transporter = nodemailer.createTransport({
						  service: 'gmail',
						  auth: {
						    user: process.env.GMAIL_USERNAME, 
						    pass: process.env.GMAIL_PASSWORD
						  }
						});

						var mailOptions = {
						  from: 'Foo from @bar.com <donotreply@bar.com>',
						  to: toAddress,
						  subject: 'Auction Winner Details - BoH',
						  html: '<h3>Auction Completed for Item - ' + bidItem + '</h3>' + '<p>Winner - ' + winner + '</p>' + '<p>Winning Amount - ' + winningAmount + '</p>'
						};
						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
							  console.log(error);
							} else {
							  bid.emailSent = 'Y'
							  bid.save();
							}
						});
					}	
				})
			}
		})
		// console.log('Done')
	})
}