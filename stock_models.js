var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/stocks';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

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

var Portfolio = new mongoose.Schema({
    PortofolioName: String,
    User: String
})

var Stock = new mongoose.Schema({
    Name: {
        type : String,
        required: 'Name of stock required'
    }
});

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
const StockModel = mongoose.model("Stocks", Stock);
const TradeModel = mongoose.model("Trades", Trade);
const PortfolioModel = mongoose.model("Portfolios", Portfolio);

module.exports = {
    UserModel,
    StockModel,
    TradeModel,
    PortfolioModel
};