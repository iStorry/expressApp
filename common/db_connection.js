var mongoose = require('mongoose');
var databaseName = require("../configs/dbconfig").Name;

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/' + databaseName;
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection

module.exports = {
    mongoose
}