const router = require('express').Router();
const tradeModel = require('./trade_models').TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

router.post("/addTrade", utils.isLoggedIn, (req, res, next) => {
    stockModel.findOne({ Name: req.body.Stock }, (err, result) => {
        if (err) {
            res.send({ "Error": "Error while finding Stock" });
            return next();
        }
        if (!result) {
            res.send({ "Error": "No Such Stock Found" });
            return next();
        }
        var trade = new tradeModel({
            Portfolio: req.user.UUC,
            Stock: req.body.Stock,
            Quantity : req.body.Quantity,            
            Price: req.body.Price,
            Time: req.body.Time || Date.now(),
            Type: req.body.TradeType
        });
        trade.save().then(() => {
            res.send(JSON.stringify({
                "Success": "OK"
            }))
        }).catch((err) => {
            res.send(JSON.stringify({
                "Error": err.code
            }))
        })
    })
})

router.post("/updateTrade", utils.isLoggedIn, (req, res, next) => {
    if (req.body.TradeId == undefined) {
        res.send({ "Error": "No Trade ID provided" });
        return next();
    }

    tradeModel.findByIdAndUpdate(tradeId, {
        Portfolio: req.user.UUC,
        Stock: req.body.Stock,
        Time: req.body.Time || Date.now,
        Quantity : req.body.Quantity,
        Price: req.body.Price,
        Type: req.body.TradeType
    }, (err, result) => {
        if (err) {
            res.send({ "Error": "Error while updating Trade" });
            return next();
        }
        if (!result) {
            res.write({ "Error": "No Such Trade Found" });
            return next();
        }
        res.send(result);
    })
})

router.post("/removeTrade", utils.isLoggedIn, (req, res, next) => {
    if (req.body.TradeId == undefined) {
        res.send({ "Error": "No Trade ID provided" });
        return next();
    }

    tradeModel.findByIdAndRemove(req.body.TradeId, (err, result) => {
        if (err) {
            res.send({ "Error": "Error while removing Trade" });
            return next();
        }
        if (!result) {
            res.send({ "Error": "No Such Trade Found" });
            return next();
        }
        res.send({
            "Success" : "OK"
        })
    })
})

module.exports = {
    router
}