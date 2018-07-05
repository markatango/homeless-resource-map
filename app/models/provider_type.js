//app/model.js
// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var ProviderTypeSchema = new Schema({
    mne: {
        type: String,
        required: true
    },
    shortDes: {
        type: String,
        required: true
    },
    longDesc: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


// Sets the created_at parameter equal to the current time
ProviderTypeSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now
    }
    next();
});


// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: scotch-users
module.exports = mongoose.model('provider_type', ProviderTypeSchema);