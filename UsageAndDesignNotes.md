# Stock Trading API

## Models

### Users
* Email : String, Unique
* Password : String
* UUC : String, Unique
* DaysToChangePassword : Number

**Email** : Client Email.
**Password** : Client Password ( Validated, 1 uppercase, 1 lowercase, 1 number, at least 6 characters )
**UUC** : Unique User Credential. Randomly generated. 6 characters.
**DaysToChangePassword** : A timer that will keep a check on user to change password regularly.

### Stocks
* Name : String, Unique
* CurrentPrice : Float

**Name** : Name of the stock.
**CurrentPrice** : Current Price of stock.

### Trades
* Portfolio : String
* Stock : String
* Quantity : Number
* Time : Date
* Type : String ( "BUY" | "SELL" )

**Portfolio** : Since it is assumed there is one portfolio per user, ucc is being used as the portfolio key that differentiates the users.
**Stock** : Stock name is being used as the stock identifier. Stock name is unique.
**Quanitity** : Quantity of stocks bought/sold
**Time** : Time is an optional parameter. If not sent, it uses the current time during the insert/update of the trade.
**Type** : Type stores a string to differentiate trade whether it is a buy or sell.

## APIs

### Users
* /login ( POST )
* /logout ( GET )
* /users/addUser ( POST )
* /users/changePassword ( POST )

**/login**: logs in a user.

Input:
```JSON
{
    "username" : "gagan1", // username is UUC
    "password" : "Hello123"
}
```
Output:
```JSON
Authenticated User :gagan1
```

**/logout**: logs out a user.

Input: None

Output:
```JSON
logout success!
```


**/users/addUser**: Adds a user.

Input:
```JSON
{
    "Email" : "Some@Email.Here"
}
```
Output:
```JSON
{
    "Email"    : "Some@Email.Here",
    "Password" : "SomeRandomPassword",
    "UUC"      : "RandomGeneratedUUC"
}
```

**/users/changePassword**: Change Password for **logged in** User.

Input:
```JSON
{
    "OldPassword"     : "old pass here",
    "NewPassword"     : "new pass here",
    "ConfirmPassword" : "confirm new pass here"
}
```

Output:
```JSON
{ "Success" : "OK" }
```

### Trade
* /portfolio/addTrade ( POST )
* /portfolio/updateTrade ( POST )
* /portfolio/removeTrade ( POST )

**/portfolio/addTrade**: Add a trade for current portfolio to the inventory.

Input:
```JSON
{
	"Stock" : "HDFC",
	"Price" : 200,
	"Quantity" : "800",
	"TradeType" : "BUY"
}
```

Output:
```JSON
{"Success":"OK"}
```


**/portfolio/updateTrade** : Update a trade for current portfolio.

Input:
```JSON
{
	"TradeId" : "5a8b1e47e19b5134c43eb43b", // ObjectId of trade
	"Stock" : "HDFC",
	"Price" : 200,
	"Quantity" : "800",
	"TradeType" : "BUY"
}
```

Output:
```JSON
{"Success":"OK"}
```


**/portfolio/removeTrade** : Remove a trade for current portfolio

Input:
```JSON
{
	"TradeId" : "5a8b1e47e19b5134c43eb43b" // ObjectId of trade
}
```

Output:
```JSON
{
    "Success": "OK"
}
```

### Portfolio
* /portfolio ( GET )
* /portfolio/holdings ( GET )
* /portfolio/returns ( GET )

**/portfolio** : Gets the portfolio

Input: None

Output:
```JSON
[
    {
        "StockName": "HDFC",
        "CurrentPrice": 300,
        "Trades": [
            {
                "Price": 100,
                "Quantity": 1000,
                "Type": "BUY"
            },
            {
                "Price": 200,
                "Quantity": 800,
                "Type": "SELL"
            }
        ]
    },
    {
        "StockName": "Reliance",
        "CurrentPrice": 300,
        "Trades": [
            {
                "Price": 200,
                "Quantity": 500,
                "Type": "SELL"
            },
            {
                "Price": 200,
                "Quantity": 720,
                "Type": "BUY"
            }
        ]
    },
    {
        "StockName": "IndiaBulls",
        "CurrentPrice": 200,
        "Trades": [
            {
                "Price": 500,
                "Quantity": 200,
                "Type": "BUY"
            }
        ]
    }
]
```

**/portfolio/holdings**: Returns the holdings in the portfolio.

Input : None

Output:
```JSON
[
    {
        "Name": "HDFC",
        "Average Price": 100,
        "Quantity": 200
    },
    {
        "Name": "Reliance",
        "Average Price": 200,
        "Quantity": 220
    },
    {
        "Name": "IndiaBulls",
        "Average Price": 500,
        "Quantity": 200
    }
]
```

**/portfolio/returns**: Gets the returns from the stocks in holdings in current portfolio.

Input : None

Output:
```JSON
[
    {
        "Name": "HDFC",
        "ProfitOrLossPerStock": 200,
        "Quantity": 200,
        "TotalProfitOrLoss": null
    },
    {
        "Name": "Reliance",
        "ProfitOrLossPerStock": 100,
        "Quantity": 220,
        "TotalProfitOrLoss": null
    },
    {
        "Name": "IndiaBulls",
        "ProfitOrLossPerStock": -300,
        "Quantity": 200,
        "TotalProfitOrLoss": null
    }
]
```


### Stocks
* /stocks/addStock ( POST )
* /stocks/removeStock ( POST )

**/stocks/addStock**:  Add a new stock.

Input:
```JSON
{
    "Name"             : "Reliance",
    "CurrentPrice"     : 123.45,
}
```

Output:
```JSON
{ "Success" : "OK" }
```

**/stocks/removeStock**: remove stock from inventory

Input:
```JSON
{
    "Name"     : "HDFC"
}
```

Output:
```JSON
{ "Success" : "OK" }
```

## Design Decisions:

1) DaysToChangePassword was kept so that the user changes password every N days. It is not yet implemented in the code. This will also need a cron job that would everyday reduce the count by 1 or other approach is storing the date when password expires.

2) Stock Name  is unique at the moment. I could have gone with the Object ID approach as well but it would increase computation next time I just want to fetch the trades. Also from my understanding the Stock name is usually unique.

3) UUC is currently used as the Portfolio key in the trades collection. In reality A user could have multiple portfolios.
So a portfolio collection will exist that will store the usser UUC and the corresponding portfolios. 
Then the Trade will contain the portfolio ID instead of UUC. 
This will further change the Trade and portfolio APIs. 
Request will contain the portfolioID/name as well.

4) Each API is considered as a module in itself and hence the models and the router configurations are kept in API specific folders. 

5) The Commons folder will contain a file to have utility functions such as password validation, email validation etc. 

6) Configuration folder will have configuration such as for database connections etc.

7) Passwords should be hashed. I wanted to do that but I am running out of time.

8) From my understanding of stock market, A person could first sell the stock and then he has to buy it ( on the same day I think ). So this API will accept a sell trade even if there are no buys. If it needs to be implemented, we need to first check if person is holding any stocks and the sell quantity less or equal to the buy quantity.

9) Other things I wanted to implement included 
	* getting trades specific to a stock, getting all buys, all sells. 
	* Multi portfolio support. 
	* Week, Month, Year High Lows for stocks  
