var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/stocks';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
const db = mongoose.connection;

module.exports = {
    db
}