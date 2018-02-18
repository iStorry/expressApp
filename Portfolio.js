const express = require('express');
var folioRouter = express.Router();
const models = require('./stock_models')

folioRouter.get("/", passport.Authenticate('local', {session: false}), (req, res) => {
    res.send("get")
})

folioRouter.get("/holdings", passport.Authenticate('local', {session: false}), (req, res) => {
    res.send("get holdings")
})

folioRouter.get("/returns", passport.Authenticate('local', {session: false}), (req, res) => {
    res.send("get returns");
})

folioRouter.post("/addTrade", passport.Authenticate('local', {session: false}), (req, res) => {
    portfolio = req.body.Portfolio;
    userUUC = req.body.userUUC;
    var portfolioId = null;
    var stockId = null;
    models.PortfolioModel.findOne({ name: portfolio, UUC: userUUC }, (err, res) => {
        if(err) {
            res.write("Error while finding portfolio");
            portfolioId = res._id;
        }
    })

    stockName = req.body.Stock;
    models.StockModel.findOne({ name: stockName }, (err, res) => {
        if(err) {
            res.write("Error while finding portfolio");
            stockId = res._id;
        }
    })

    var trade = new models.TradeModel({
        Portfolio: portfolioId,
        Stock: stockId,
        Price: req.body.Price,
        Time: req.body.Time || Date.now,
        Type: req.body.Type
    });
    trade.save()
    .then(() => {
        res.write("Success!");
        res.end()
    })
    .catch((err) => {
        res.write("Errror!");
        res.end()
    })
})

folioRouter.post("/updateTrade", passport.Authenticate('local', {session: false}), (req, res) => {
    res.send("update trade");
})

folioRouter.post("/removeTrade", passport.Authenticate('local', {session: false}), (req, res) => {
    res.send("remove trade");
})

module.exports = {
    folioRouter
}