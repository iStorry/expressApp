const router = require('express').Router();
const models = require('./stock_models')
const utils = require("../common/utils")

/*
    Path : "/stocks/addStock"
    Method : Post
    Params : { "Name" : String,
               "CurrentPrice", Float }
    SuccessResponse : { "Success" : "OK" }
    FailureResponse : {"Error": "Empty stock name"} |
                      { "Error" : ErrorCode } 
    Description : Add Stock API
*/
router.post("/addStock", (req, res, next) => {

    if (req.body.Name == undefined || req.body.Name == null) {
        res.send({ "Error": "Empty stock name" });
        return next();
    }

    const stock = new models.StockModel({
        Name: req.body.Name,
        CurrentPrice: req.body.CurrentPrice
    });

    stock.save().then(() => {
        res.send({ "Success": "OK" });
        return next();
    }).catch((err) => {
        res.send({ "Error": err.code })
        return next();
    })
})

/*
    Path : "stocks/removeStock/"
    Method : Post
    Params : { "Name" : String }
    SuccessResponse : { "Success" : "OK" }
    FailureResponse : {"Error": "Empty stock name"}      | 
                      { "Error" : ErrorCode }            |
                      { "Error": "No such Stock found" }
    Description : Add Stock API
*/
router.post("/removeStock", (req, res, next) => {
    if (req.body.Name == undefined || req.body.Name == null) {
        res.send({ "Error": "Empty stock name" });
        return next();
    }

    models.StockModel.findOneAndRemove({ Name: req.body.Name }, (err, result) => {
        if (err) {
            res.send({ "Error": err.code });
            return next();
        }
        if (!result) {
            res.send({ "Error": "No such Stock found" });
            return next();
        }
        res.send({
            "Success": "OK"
        })
    })
})

module.exports = {
    router
}