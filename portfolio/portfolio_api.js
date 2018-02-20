const router = require('express').Router();
const tradeModel = require("../trades/trade_models").TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

router.get("/", utils.isLoggedIn, (req, res) => {
    var ret = [];
    tradeModel.find({ Portfolio: req.user.UUC }, (err, result) => {
        if (err) {
            res.send({
                "Error": "Unable to get the trades"
            })
            return next();
        }
        if (!result) {
            res.send({
                "Error": "No trades found"
            })
            return next();
        }

        for (var i = 0; i < result.length; i++) {
            var trade = result[i];
            var found = false;
            ret.forEach(element => {
                if (element.StockName == trade.Stock) {
                    element.Price += trade.Price;
                    element.Counter += 1;
                    element.Quantity += trade.Quantity;
                    found = true;
                }
            });
            if (!found) {
                ret.push({ StockName: trade.Stock, Price: trade.Price, Quantity: trade.Quantity, Counter: 0 })
            }
        }
        res.send(ret);
    })
})

router.get("/holdings", utils.isLoggedIn, (req, res) => {
    var ret = []
    var responseData = []
    tradeModel.find({ Portfolio: req.user.UUC }, (err, result) => {
        if (err) {
            res.send({
                "Error": "Unable to get the trades"
            })
            return next();
        }
        if (!result) {
            res.send({
                "Error": "No trades found"
            })
            return next();
        }

        for (var i = 0; i < result.length; i++) {
            var trade = result[i];
            var found = false;

            for(var x = 0; x < ret.length; x++) {
                var element = ret[x];
                if (element.StockName == trade.Stock) {
                    if (trade.Type == "BUY") {
                        element.Price += trade.Price;
                        element.Counter += 1;
                        element.Quantity += trade.Quantity;
                    } else {
                        element.Quantity -= trade.Quantity;
                    }
                    found = true;
                    break;
                }
            }

            if (!found) {
                var qty = 0;
                if(trade.Type == "BUY") {
                    qty = trade.Quantity;
                } else {
                    qty = -trade.Quantity;
                }
                ret.push({ StockName: trade.Stock, Price: trade.Price, Quantity: qty, Counter: 1 })
            }
        }

        ret.forEach(element => {
            var Price = element.Price/ element.Counter;
            responseData.push({"Name" : element.StockName, "Average Price" : Price, "Quantity" : element.Quantity });
        })

        res.send(responseData);
    })
})

router.get("/returns", utils.isLoggedIn, (req, res) => {

})

module.exports = {
    router
}  