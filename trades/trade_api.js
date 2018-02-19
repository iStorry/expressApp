const router = require('express').Router();
const tradeModel = require('./trade_models').TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

router.post("/addTrade", utils.isLoggedIn, (req, res, next) => {
    stockName = req.body.Stock;
    stockModel.findOne({ name: stockName }, (err, result) => {
        if(err) {
            res.write(JSON.stringify({
                "Error" : "Error while finding Stock"                
            }));
            return next();
        }
        if(!result) {
            res.write(JSON.stringify({
                "Error" : "No Such Stock Found"
            }));
            return next();
        }
        var trade = new tradeModel({
            Portfolio: req.user.UUC,
            Stock: stockName,
            Price: req.body.Price,
            Time: req.body.Time || Date.now(),
            Type: req.body.TradeType
        });
        trade.save()
        .then(() => {
            res.send(JSON.stringify({
                "Success" : "OK"
            }))
        })
        .catch((err) => {
            res.send(JSON.stringify({
                "Error" : err.code
            }))
        })
        })
})

router.post("/updateTrade", utils.isLoggedIn, (req, res, next) => {
    if(req.body.tradeId == undefined) {
        res.send({
            "Error" : "No Trade ID provided"
        });
        return next();
    }
    tradeModel.findByIdAndUpdate(tradeId, {
        Portfolio: req.user.UUC,
        Stock: req.body.Stock,
        Time: req.body.Time || Date.now,
        Price: req.body.Price,
        Type: req.body.TradeType
    }, (err, result) => {
        if(err) {
            res.write(JSON.stringify({
                "Error" : "Error while updating Trade"                
            }));
            res.end();
            return next();
        }
        if(!result) {
            res.write(JSON.stringify({
                "Error" : "No Such Trade Found"
            }));
            res.end();
            return next();
        }
        res.send(result);
    })
})

router.post("/removeTrade", utils.isLoggedIn, (req, res, next) => {
    if(req.body.tradeId == undefined) {
        res.send({
            "Error" : "No Trade ID provided"
        });
        return next();
    }
    tradeModel.findByIdAndRemove(tradeId, (err, result) => {
        if(err) {
            res.write(JSON.stringify({
                "Error" : "Error while removing Trade"                
            }));
            res.end();
            return next();
        }
        if(!result) {
            res.write(JSON.stringify({
                "Error" : "No Such Trade Found"
            }));
            res.end();
            return next();
        }
    })
})

module.exports = {
    router
}