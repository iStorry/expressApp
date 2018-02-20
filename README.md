REST API based stock trading.

Each folder defines a module,
* portfolio
* Stocks
* trades
* users

### Portfolio:
Contains Portfolio specific API and Model

APIs:
* getPortfolio
* getHoldings
* getReturns

### Stocks:
Contains Stock specific API and Model

APIs:
* addStock
* removeStock

### Trades:
Contains Trade specific API and Model

APIs:
* addTrade
* updateTrade
* removeTrade

### Users:
Contains User specific API and Model

APIs:
* addUser
* changePassword


### Auth:
Authentication Module

### Dependencies:
* MongoDB
* NodeJS
* Express Framework
* Mongoose
* Passport
* Mongoose-float
* Express-session
* Passport-local

Running:

    git clone https://github.com/gaganjyot/expressApp.git
    npm install
    npm start