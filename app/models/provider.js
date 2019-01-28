//app/model.js
// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creates a Provider Schema. This will be the basis of how user data is stored in the db
var ProviderSchema = new Schema({
    Street_Address : {
        type: String,
        required : true
    },
		Services : {
        type: String,
        required : true
    },
		First_Name : {
        type: String,
        required : true
    },
		Last_Name : {
        type: String,
        required : true
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
        required : true
    },
		Population : {
        type: String,
        required : true
    },
		Hours_of_operation : {
        type: String,
        required : true
    },
		Suite_Floor_Dept_Room : {
        type: String
    },
		State : {
        type: String,
        required : true
    },
		City : {
        type: String,
        required : true
    },
		Zip : {
        type: Number,
        required : true
    },
		Phone : {
        type: String,
        required : true
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
        default: Date.now
    }
});

// Sets the created_at parameter equal to the current time
ProviderSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now
    }
    next();
});


// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: scotch-users
module.exports = mongoose.model('provider', ProviderSchema);