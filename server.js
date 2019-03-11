const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan"); // for logging requests

//require all models

const db = require("./models");

const PORT = process.env.PORT || 3000;

//initializes express
const app = express();

app.use(logger('dev'));

//handlebars

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


//use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//  express.static to serve public folder as static dir
app.use(express.static("public"));

//Routes
const routes = require("./routes");
//all requests go through routes
app.use(routes);

// if deployed, use deployed db; otherwise use local db
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

//set mongoose to leverage built in js es6 promises
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// start server
app.listen(PORT, () => {
    console.log("listening on PORT: ${PORT}");
});