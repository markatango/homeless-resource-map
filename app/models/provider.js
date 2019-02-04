//app/model.js
// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creates a Provider Schema. This will be the basis of how user data is stored in the db
var ProviderSchema = new Schema({
        Street_Address : {
        type: String,
        required : false
    },
		Services : {
        type: String,
        required : false
    },
		First_Name : {
        type: String,
        required : false
    },
		Last_Name : {
        type: String,
        required : false
    },
		Agency : {
        type: String,
        required : true
    },
		Title : {
        type: String
    },
		Service_Type : {
        type: String,
        required : false
    },
		Population : {
        type: String,
        required : false
    },
		Hours_of_operation : {
        type: String,
        required : false
    },
		Suite_Floor_Dept_Room : {
        type: String
    },
		State : {
        type: String,
        required : false
    },
		City : {
        type: String,
        required : false
    },
		Zip : {
        type: Number,
        required : false
    },
		Phone : {
        type: String,
        required : false
    },
		Email : {
        type: String
    },
		Website : {
        type: String
    },
		Location : {
			latitude : {
            type: Number
            },
            
            longitude : {
            type: Number
            }
        },
		CensusPlaceFips : {
        type: Number
    },
		CensusMsaFips : {
        type: Number
    },
		CensusMetDivFips : {
        type: Number
    },
		CensusMcdFips : {
        type: Number
    },
		CensusCbsaMicro : {
        type: Number
    },
		CensusCbsaFips : {
        type: Number
    },
		CensusBlock : {
        type: Number
    },
		CensusBlockGroup : {
        type: Number
    },
		CensusTract : {
        type: Number
    },
		CensusCountyFips : {
        type: Number
    },
		CensusStateFips : {
        type: Number
    },
        updated_at: {
        type: Date,
        default: Date.now,
        required: true
    },
        created_at: {
        type: Date
    }
});

// Sets the created_at parameter equal to the current time
ProviderSchema.pre('save', function (next) {
    console.log("in pre...");
    now = new Date();
    console.log("creating a document: " + now);
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
        console.log("creating...");
    }
    next();
});


// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: scotch-users
module.exports = mongoose.model('provider', ProviderSchema);