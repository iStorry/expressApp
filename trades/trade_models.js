const db = require('../common/db_connection')
const Float = require('mongoose-float').loadType(db.mongoose, 2);

var Trade = new db.mongoose.Schema({
    // Portfolio : {
    //     type : db.mongoose.Schema.Types.ObjectId,
    //     required: 'Portfolio required'
    // },
    Stock : {
        type : String,
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

const TradeModel = db.mongoose.model("Trade", Trade);

module.exports = {
    TradeModel
}