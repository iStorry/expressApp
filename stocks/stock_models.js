const db = require('../common/db_connection')

var Stock = new db.mongoose.Schema({
    Name: {
        type : String,
        required: 'Name of stock required'
    }
});

const StockModel = db.mongoose.model("Stocks", Stock);

module.exports = {
    StockModel,
};