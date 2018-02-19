const router = require('express').Router();
const tradeModel = require("../trades/trade_models").TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

router.get("/", utils.isLoggedIn, (req, res) => {
    var ret = {}
    tradeModel.find({Portfolio : req.user.UUC }, (err, result) => {
        if(err) {
            res.send({
                "Error" : "Unable to get the trades"
            })
            return next();
        }
        if(!result) {
            res.send({
                "Error" : "No trades found"
            })
            return next();
        }

        for(var trade in result) {
            if(ret.hasOwnProperty(trade.Stock)) {
                ret[trade.Stock].push({ "Price": trade.Price, "Type" : trade.Type })
            } else {
                ret[trade.Stock] = [{ "Price": trade.Price, "Type" : trade.Type }]
            }
        }

        res.send(ret);
    })
})

router.get("/holdings", utils.isLoggedIn, (req, res) => {
    tradeModel.find({Portfolio : req.user.UUC }, (err, result) => {
        if(err) {
            res.send({
                "Error" : "Unable to get the trades"
            })
            return next();
        }
        if(!result) {
            res.send({
                "Error" : "No trades found"
            })
            return next();
        }
//        res.send(result);
    })
})

router.get("/returns", utils.isLoggedIn, (req, res) => {

})

module.exports = {
    router
}  