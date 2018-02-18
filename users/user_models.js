var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

var User = new mongoose.Schema({
    Email : {
        type: String,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    Password: {
        type: String,
        required: true,
    },
    DaysToPasswordChange : {
        type: Number,
        default: 15
    },
    UUC: {
        type: String,
        required: true,
        maxlength: 6,
        maxlength: 6
    }
});

const UserModel = mongoose.model("Users", User);

module.exports = {
    UserModel
}