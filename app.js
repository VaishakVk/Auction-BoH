const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const cron = require("node-cron");
const schedule = require('node-schedule');

const userRoutes = require("./routes/user.js");
const itemRoutes = require("./routes/items.js");
const bidRoutes = require("./routes/bid.js");

const bidFinalize = require("./controllers/bidFinalize.js");
 
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();

const MONGODB_URI  = "mongodb+srv://"+process.env.MONGO_USER+ ":" + process.env.MONGO_PASSWORD + "@clusterdb-ohjmw.mongodb.net/" + process.env.MONGO_DEFAULT_DATABASE

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/bid", bidRoutes);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
	.then(() => {
		// const today = new Date()
		// console.log(today)
		// cron.schedule
		schedule.scheduleJob("0 * * * *", () => {
			bidFinalize();
		})
	})
	.catch(err => {
		if(err) {
			console.log('Error connecting to DB');
		}
	})

app.listen(process.env.PORT || 3000)	