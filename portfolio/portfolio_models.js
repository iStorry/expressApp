var mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);

var Portfolio = new mongoose.Schema({
    PortofolioName: String,
    User: String
})

const PortfolioModel = mongoose.model("Portolio", Portfolio);

module.exports = {
    PortfolioModel
}