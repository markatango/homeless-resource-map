// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.HRM_PORT || 3000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect("mongodb://localhost:27017/homeless", {useNewUrlParser: true}).then(
  () => { console.log("MongoDB is up and running.") },
  err => { 
	console.log("Please start MongoDB and try again.");
	process.exit(1);
	/* const spawn = require('child_process').spawn;
    const pipe = spawn('mongod')
	mongoose.connect("mongodb://localhost/homeless", {useNewUrlParser: true}) */
});

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
																// Use BowerComponents
app.use('/bower_components',  express.static(__dirname + '/bower_components')); 
app.use(morgan('common'));                                      // log with Morgan on 'node <*.js>' command line console 
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());										// default getter: X-HTTP-Method-Override
																// default options.methods: ['POST']

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
