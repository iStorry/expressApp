const router = require('express').Router();
const tradeModel = require("../trades/trade_models").TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

/*
    Path : "/portfolio"
    Method : Get
    AuthenticationRequired : True
    Params : None
    SuccessResponse : [ Portfolio ]
    FailureResponse : { "Error": "Unable to get the trades" } |
                      { "Error": "No trades found" }          |
    Description : Portfolio API
*/
router.get("/", utils.isLoggedIn, (req, res, next) => {
    var ret = [];
    var responseData = [];

    tradeModel.find({ Portfolio: req.user.UUC }, (err, result) => {
        if (err) {
            res.send({ "Error": err })
            return next();
        }
        if (!result) {
            res.send({ "Error": "No trades found" })
            return next();
        }

        /*
            This parses all the trades and groups into objects on the basis of stock Name.
        */

        for (var i = 0; i < result.length; i++) {
            var trade = result[i];
            var found = false;
            for (let x = 0; x < ret.length; x++) {
                const element = ret[x];
                if (element.StockName == trade.Stock) {
                    element.Trades.push({
                        Price: trade.Price,
                        Quantity: trade.Quantity,
                        Type: trade.Type
                    });
                    found = true;
                    break;
                }
            }
            if (!found) {
                ret.push({
                    StockName: trade.Stock,
                    Trades: [
                        {
                            Price: trade.Price,
                            Quantity: trade.Quantity,
                            Type: trade.Type
                        }
                    ]
                });
            }
        }

        /*
            We fetch additional details from the Stocks model here and merge it with the trades data. 
        */
        var promises = []
        ret.forEach(element => {
            var res = {}
            promises.push(new Promise((resolve, reject) => {
                stockModel.findOne({ Name: element.StockName }, (err, stock) => {
                    if (err) {
                        reject(err);
                    }
                    if (!stock) {
                        reject(new Error("No such stock found"))
                    }

                    res.StockName = stock.Name;
                    res.CurrentPrice = stock.CurrentPrice;
                    res.Trades = element.Trades;
                    resolve(res);
                });
            }));
        });

        Promise.all(promises).then((values) => {
            res.send(values);
        }).catch((err) => {
            res.send({ "Error": err });
            next();
        });
    })
})

/*
    Path : "/portfolio/holdings"
    Method : Get
    AuthenticationRequired : True
    Params : None
    SuccessResponse : [ Holdings ]
    FailureResponse : { "Error": error } |
                      { "Error": "No trades found" }          |
    Description : Holdings API
*/
router.get("/holdings", utils.isLoggedIn, (req, res) => {
    var ret = []
    var responseData = []
    tradeModel.find({ Portfolio: req.user.UUC }, (err, result) => {
        if (err) {
            res.send({ "Error": err })
            return next();
        }
        if (!result) {
            res.send({ "Error": "No trades found" })
            return next();
        }

        /*
            if trade is buy, we add the price, increment the counter and
            also add the quantity
            if trade is sell, we just reduce the quantity.

            The quantity value is the numbers of stocks we're holding.

            we summed up all the prices and then divide it by the counter value
            it will give us the average price.
        */

        for (var i = 0; i < result.length; i++) {
            var trade = result[i];
            var found = false;

            for (var x = 0; x < ret.length; x++) {
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

            /*
                Same as commented abbove. If buy, we add quantity
                otherwise we substract the quantity
            */

            if (!found) {
                var qty = 0;
                if (trade.Type == "BUY") {
                    qty = trade.Quantity;
                } else {
                    qty = -trade.Quantity;
                }
                ret.push({ StockName: trade.Stock, Price: trade.Price, Quantity: qty, Counter: 1 })
            }
        }


        /*
            We calculate the average here by dividing the price by counter.
        */
        ret.forEach(element => {
            var Price = element.Price / element.Counter;
            responseData.push({ "Name": element.StockName, "Average Price": Price, "Quantity": element.Quantity });
        })

        res.send(responseData);
    })
})

/*
    Path : "/portfolio/holdings"
    Method : Get
    AuthenticationRequired : True
    Params : None
    SuccessResponse : [ returns ]
    FailureResponse : { "Error": "Unable to get the trades" }                       |
                      { "Error": "No trades found" }                                |
                      { "Error": "Error while retriving stocks" }                   |
                      { "Error": "Unable to read stock with name: Some name here" } |
    Description : Holdings API
*/
router.get("/returns", utils.isLoggedIn, (req, res) => {
    // Major code is similar as holdings code.
    // Wanted to extract everything into interface that API would consume but running out of time.
    var ret = []
    var responseData = []
    tradeModel.find({ Portfolio: req.user.UUC }, (err, result) => {
        if (err) {
            res.send({ "Error": err })
            return next();
        }
        if (!result) {
            res.send({ "Error": "No trades found" })
            return next();
        }

        // Aggregates the trades
        for (var i = 0; i < result.length; i++) {
            var trade = result[i];
            var found = false;

            for (var x = 0; x < ret.length; x++) {
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
                if (trade.Type == "BUY") {
                    qty = trade.Quantity;
                } else {
                    qty = -trade.Quantity;
                }
                ret.push({ StockName: trade.Stock, Price: trade.Price, Quantity: qty, Counter: 1 })
            }
        }

        // Get Average price for each Stock
        ret.forEach(element => {
            var Price = element.Price / element.Counter;
            responseData.push({ "Name": element.StockName, "AveragePrice": Price, "Quantity": element.Quantity });
        })

        // compare with the current price of stock and get profit/loss
        var promises = []
        responseData.forEach(element => {
            var res = {}
            promises.push(new Promise((resolve, reject) => {
                stockModel.findOne({ Name: element.Name }, (err, stock) => {
                    if (err) {
                        reject(err);
                    }
                    if (!stock) {
                        reject(new Error("No such stock found"))
                    }

                    res.Name = element.Name;
                    res.ProfitOrLossPerStock = stock.CurrentPrice - element.AveragePrice;
                    res.Quantity = element.Quantity;
                    res.TotalProfitOrLoss = res.ProfitOrLossPerStock * res.Quantity;
                    resolve(res);
                });
            }));
        });

        Promise.all(promises).then((values) => {
            res.send(values);
        }).catch((err) => {
            res.send({ "Error": err });
            next();
        });

    })
})

module.exports = {
    router
}