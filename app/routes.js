//app/routes.js
// Dependencies
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Provider = require('./models/provider.js');
var Provider_type = require('./models/provider_type.js');
var util = require("util");

// Opens App Routes
module.exports = function (app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    /*app.get('/users', function (req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function (err, users) {
            if (err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users); // orig

        });
    });*/
    
    // Retrieve records for all provider types in the db
    app.get('/provider_types', function (req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Provider_type.find({});
        query.exec(function (err, provider_types) {
            if (err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all provider_types
            res.json(provider_types); // orig

        });
    });
    
    
    
    
    
    // Retrieve records for all providers in the db
    app.get('/providers', function (req, res) {
        //console.log(util.inspect(req.body));
        //res.json({message:"test Get"});// orig
        
        // Uses Mongoose schema to run the search (empty conditions)
        
        var query = Provider.find({}, {
            /*Street_Address : 1,
            City : 1,
            Zip : 1,
            Phone : 1,
            Email : 1,
            Website : 1,
            Location : 1,
            Agency : 1,
            Service_Type : 1,
            Population : 1,
            Hours_of_operation : 1,
            _id:0
            ,
          
            Last_Name : 0,
            Title : 0,
            Suite_Floor_Dept_Room : 0,
            State : 0,       
            CensusPlaceFips : 0,
            CensusMsaFips : 0,
            CensusMetDivFips : 0,
            CensusMcdFips : 0,
            CensusCbsaMicro : 0,
            CensusCbsaFips : 0,
            CensusBlock : 0,
            CensusBlockGroup : 0,
            CensusTract : 0,
            CensusCountyFips : 0,
            CensusStateFips : 0 */
        });
        
       query.exec(function (err, results) {
            if (err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all providers
            if(results) {
                res.json(results); 
            } else {
                res.json({message:"No providers found"});// orig
            };

        });
    });



    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function (req, res) {

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function (err) {
            if (err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
    
    app.post('/providerlocsbytype', function(req, res){
        var query = req.body.query;
		console.log(util.inspect(req.body));
        var projection = req.body.projection;
        
        var query = Provider.find(query, projection);
        query.exec(function (err, locations) {
            if (err)
                res.send(err);

            // If no errors, respond with a JSON of all locations that meet the criteria
            res.json(locations);
        });
        
    });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function (req, res) {

        // Grab all of the query parameters from the body.
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var distance = req.body.distance;
        var male = req.body.male;
        var female = req.body.female;
        var other = req.body.other;
        var minAge = req.body.minAge;
        var maxAge = req.body.maxAge;
        var favLang = req.body.favlang;
        var reqVerified = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = User.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if (distance) {

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({
                center: {
                    type: 'Point',
                    coordinates: [long, lat]
                },

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34,
                spherical: true
            });
        }

        // ...include filter by Gender (all options)
        if (male || female || other) {
            query.or([{
                'gender': male
            }, {
                'gender': female
            }, {
                'gender': other
            }]);
        }

        // ...include filter by Min Age
        if (minAge) {
            query = query.where('age').gte(minAge);
        }

        // ...include filter by Max Age
        if (maxAge) {
            query = query.where('age').lte(maxAge);
        }

        // ...include filter by Favorite Language
        if (favLang) {
            query = query.where('favlang').equals(favLang);
        }

        // ...include filter for HTML5 Verified Locations
        if (reqVerified) {
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function (err, users) {
            if (err)
                res.send(err);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(users);
        });
    });
};