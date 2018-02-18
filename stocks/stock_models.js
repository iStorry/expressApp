var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

var Stock = new mongoose.Schema({
    Name: {
        type : String,
        required: 'Name of stock required'
    }
});

const StockModel = mongoose.model("Stocks", Stock);

module.exports = {
    StockModel,
};