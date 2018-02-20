const db = require('../common/db_connection')
const Float = require("mongoose-float").loadType(db.mongoose, 2);


var Stock = new db.mongoose.Schema({
    Name: {
        type : String,
        required: 'Name of stock required'
    },
    CurrentPrice : {
        type: Float,
        required : 'Current Price required'
    }
});

const StockModel = db.mongoose.model("Stocks", Stock);

module.exports = {
    StockModel,
};