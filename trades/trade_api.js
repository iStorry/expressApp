const router = require('express').Router();
const models = require('./trade_models');
const utils = require("../common/utils")

router.post("/addTrade", utils.isLoggedIn, (req, res) => {
    // var portfolioId = null;

    // portfolio = req.body.Portfolio;
    // userUUC = req.body.userUUC;

    // models.PortfolioModel.findOne({ name: portfolio, UUC: userUUC }, (err, res) => {
    //     if(err) {
    //         res.write(JSON.stringify({
    //             "Error" : "Error while finding portfolio"
    //         }));
    //         res.end();
    //         return next();
    //     }
    //     if(!res) {
    //         res.write(JSON.stringify({
    //             "Error" : "No portfolio found"
    //         }));
    //         res.end();
    //         return next();
    //     }
    //     portfolioId = res._id
    // })

    stockName = req.body.Stock;
    models.StockModel.findOne({ name: stockName }, (err, res) => {
        if(err) {
            res.write(JSON.stringify({
                "Error" : "Error while finding Stock"                
            }));
            res.end();
            return next();
        }
        if(!res) {
            res.write(JSON.stringify({
                "Error" : "No Such Stock Found"
            }));
            res.end();
            return next();
        }
    })

    var trade = new models.TradeModel({
        // Portfolio: portfolioId,
        Stock: StockName,
        Price: req.body.Price,
        Time: req.body.Time || Date.now,
        Type: req.body.Type
    });
    trade.save()
    .then(() => {
        res.send({
            "Success" : "OK"
        })
    })
    .catch((err) => {
        res.send({
            "Error" : err.code
        })
    })
})

router.post("/updateTrade", utils.isLoggedIn, (req, res) => {

})

router.post("/removeTrade", utils.isLoggedIn, (req, res) => {
    res.send("remove trade");
})

module.exports = {
    router
}