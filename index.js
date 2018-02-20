const app  = require('express')();
const user = require("./users/user_api");
const folio = require("./portfolio/portfolio_api");
const trade = require("./trades/trade_api");
const stocks = require("./stocks/stocks_api");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// Authentication Configuration
require("./auth")(app, passport, localStrategy);

// Routes
app.use("/portfolio/", folio.router);
app.use("/portfolio/", trade.router);
app.use("/stocks/", stocks.router);
app.use("/user/", user.router);

// Kickoff Server
app.listen(3001, function(){
    console.log("listening 3000");
})