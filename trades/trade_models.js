var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

var Trade = new mongoose.Schema({
    Portfolio : {
        type : mongoose.Schema.Types.ObjectId,
        required: 'Portfolio required'
    },
    Stock : {
        type : mongoose.Schema.Types.ObjectId,
        required: 'stock required for which the trade has happened'
    },
    Price: {
        type: Float,
        required: 'Price of stock trade required'
    },
    Time: {
        type: Date,
        required: 'Date/Time of stock trade required'
    },
    Type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: 'Stock trade type required'
    }
});

const TradeModel = mongoose.model("Trade", Trade);

module.exports = {
    TradeModel
}