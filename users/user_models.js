const db = require('../common/db_connection')

var User = new db.mongoose.Schema({
    Email : {
        type: String,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    Password: {
        type: String,
        minlength: 6,
        required: true,
    },
    DaysToPasswordChange : {
        type: Number,
        default: 15
    },
    UUC: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 6
    }
});

User.methods.validPassword = function(pass, cb) {
    return this.Password == pass;
}

const UserModel = db.mongoose.model("Users", User);

module.exports = {
    UserModel
}