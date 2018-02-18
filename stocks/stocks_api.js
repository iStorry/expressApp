const router = require('express').Router();
const models = require('./stock_models')

router.post("/addStock", (req, res) => {
    res.send("post")
})

router.post("/removeStock", (req, res) => {

})

router.post("/updateStock", (req, res) => {

})

module.exports = {
    router
}