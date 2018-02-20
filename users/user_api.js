const router = require('express').Router();
const utils = require('../common/utils');
const userModel = require('./user_models').UserModel;

/*
    Path : "/user"
    Method : Get
    Params : None
    Response : "User module"
    Description : API Check
*/
router.get("/", (req, res) => {
    res.send("User module!");
})

/*
    Path : "/user/addUser"
    Method : Post
    Params : { "Email" : String Required }
    SuccessResponse : { "Success" : "OK", UserData }
    FailureResponse : { "Error": "Doesn't Looks like an email" } |
                      { "Error": ErrorCode }
    Description : User Add API
*/
router.post("/addUser", (req, res, next) => {
    var email = req.body.Email;

    if (!utils.validateEmail(email)) {
        res.send({ "Error": "Doesn't Looks like an email" });
        return next();
    }

    const randUUC = utils.randStr(6);
    const randPass = utils.randStr(10);

    var query = userModel.find({}).select('UUC -_id');

    query.exec(function (err, result) {
        if (err) return next(err);

        // Checks if the random UUC is already present in DB
        while (result.includes(randUUC)) {
            randUUC = utils.randStr(6);
        }

        var newUser = new userModel({
            Email: email,
            Password: randPass,
            UUC: randUUC,
            DaysToPasswordChange: 0
        });
        newUser.save().then(() => {
            res.send({
                "Status": "OK",
                "Data": {
                    "Email": email,
                    "UUC": randUUC,
                    "Password": randPass
                }
            });
        }).catch((err) => {
            res.send({
                "Status": "Error",
                "Code": err.code
            });
        });
    });

})

/*
    Path : "/user/addUser"
    Method : Post
    Params : { "OldPassword" : String,
               "NewPassword" : String,
               "ConfirmPassword" : String
    }
    SuccessResponse : { "Success" : "OK", UserData }
    FailureResponse : { "Error": "New Password and Confirm Password do not match" } |
                      { "Error": "Password Validation Failed" }                     | 
                      { "Error": err.code }                                         |
                      { "Error": "Incorrect User" }                                 |
                      { "Error": "Incorrect Password" }                             |
                      { "Error": "Incorrect Credentials" }
    Description : Change Usesr Password API
*/
router.post("/changePassword", utils.isLoggedIn, (req, res, next) => {
    var uuc = req.user.UUC;
    var oldPass = req.body.OldPassword;
    var newPass = req.body.NewPassword;
    var confirmPass = req.body.ConfirmPassword;

    if (newPass != confirmPass) {
        res.send({ "Error": "New Password and Confirm Password do not match" });
        return next();
    }

    if (utils.validatePassword(newPass)) {
        res.send({ "Error": "Password Validation Failed" });
        return next();
    }

    userModel.findOneAndUpdate({ UCC: ucc, Password: oldPass }, { Password: newPassword, DaysToPasswordChange: 15 }, (err, val) => {
        if (err) {
            res.send({ "Error": err.code })
            return next();
        }
        if (!val) {
            res.send({ "Error": "Incorrect Credentials" })
            return next();
        }
        res.send({ "Success": "OK" })
    })
})

module.exports = {
    router
}