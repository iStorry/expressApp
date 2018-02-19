const router = require('express').Router();
const models = require('./stock_models')
const utils = require("../common/utils")

router.post("/addStock", (req, res) => {
    if(req.body.name == undefined || req.body.name == null) {
        res.write(JSON.stringify({
            "Error" : "Empty stock name"
        }));
        res.end();
        return next();
    }
    const stock = new models.StockModel({ Name: req.body.name });
    stock.save()
    .then(() => {
        res.write(JSON.stringify({
            "Success" : "OK",
        }));
        res.end();
        return next();
    })
    .catch((err) => {
        res.write(JSON.stringify({
            "Error" : err.code,
        }))
        res.end();
        return next();        
    })
})

router.post("/removeStock", (req, res) => {
    if(req.body.name == undefined || req.body.name == null) {
        res.write(JSON.stringify({
            "Error" : "Empty stock name"
        }));
        res.end();
        return next();
    }
    models.StockModel.findOneAndRemove({Name : req.body.Name}, (err, result) => {
        if(err) {
            res.write(JSON.stringify({
                "Error" : err.code
            }));
            res.end();
            return next();
        }
        if(!result) {
            res.write(JSON.stringify({
                "Error" : err.code
            }));
            res.end();
            return next();
        }
    })
})

module.exports = {
    router
}