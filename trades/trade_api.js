const router = require('express').Router();
const tradeModel = require('./trade_models').TradeModel;
const stockModel = require("../stocks/stock_models").StockModel;
const utils = require("../common/utils")

/*
    Path : "/portfolio/addTrade"
    Method : Post
    AuthenticationRequired : True
    Params : { "Stock" : String,
               "Quantity" : Number,
               "Price" : Float,
               "Time" : Date // Optional,
               "TradeType" : String
    }
    SuccessResponse : { "Success" : "OK" }
    FailureResponse : { "Error": "Error while finding Stock" } |
                      { "Error": "No Such Stock Found" }       |
                      { "Error": someErrorCode }
    Description : Add Trade API
*/
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
            res.send({ "Success": "OK" })
        }).catch((err) => {
            res.send({ "Error": err.code })
        })
    })
})

/*
    Path : "/portfolio/updateTrade"
    Method : Post
    AuthenticationRequired : True
    Params : { "TradeId" : ObjectId Required
               "Stock" : String, // Optional
               "Quantity" : Number, // Optional
               "Price" : Float, // Optional
               "Time" : Date // Optional,
               "TradeType" : // Optional
    }
    SuccessResponse : { "Success" : "OK" }
    FailureResponse : { "Error": "No Trade ID provided" }        |
                      { "Error": "Error while updating Trade" }  |
                      { "Error": "No Such Trade Found" }
    Description : Update Trade API
*/
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
        res.send({ "Success" : "Ok" });
    })
})

/*
    Path : "/portfolio/removeTrade"
    Method : Post
    AuthenticationRequired : True
    Params : { "TradeId" : ObjectId Required }
    SuccessResponse : { "Success" : "OK" }
    FailureResponse : { "Error": "No Trade ID provided" }        |
                      { "Error": "Error while updating Trade" }  |
                      { "Error": "No Such Trade Found" }
    Description : remove Trade API
*/
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