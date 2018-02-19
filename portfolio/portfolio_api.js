const router = require('express').Router();
const trades = require("../trades/trade_models");
const stocks = require("../stocks/stock_models");
const utils = require("../common/utils")

router.get("/", utils.isLoggedIn, (req, res) => {
    trades.TradeModel.find((err, result) => {
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
        res.send(result);
    })
})

router.get("/holdings", utils.isLoggedIn, (req, res) => {

})

router.get("/returns", utils.isLoggedIn, (req, res) => {

})

module.exports = {
    router
}  