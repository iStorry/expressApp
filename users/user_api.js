const router = require('express').Router();
const utils = require('../common/utils');
const models = require('./user_models')

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

    var query = models.UserModel.find({}).select('UUC -_id');

    query.exec(function (err, result) {
        if (err) return next(err);

        // Checks if the random UUC is already present in DB
        while(result.includes(randUUC)) {
            randUUC = utils.randStr(6);
        }

        var newUser = new models.UserModel({
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
    Params : { "UUC" : String,
               "OldPassword" : String,
               "NewPassword" : String,
               "ConfirmPassword" : String
    }
    SuccessResponse : { "Success" : "OK", UserData }
    FailureResponse : { "Error": "New Password and Confirm Password do not match" } |
                      { "Error": "Password Validation Failed" }                     | 
                      { "Error": err.code }                                         |
                      { "Error": "Incorrect User" }                                 |
                      { "Error": "Incorrect Password" }                             |
                      { "Error": "Error while updating the password" }
    Description : Change Usesr Password API
*/
router.post("/changePassword", (req, res, next) => {
    var uuc = req.body.UUC;
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

    models.UserModel.findOne({ UUC: uuc }, (err, user) => {

        if (err) {
            res.send({ "Error": err.code });
            return next();
        }
        if (!user) {
            res.send({ "Error": "Incorrect User" });
            return next();
        }
        if (!user.validPassword(oldPass)) {
            res.send({ "Error": "Incorrect Password" });
            return next();
        }

        models.UserModel.update({ Email: email }, { Password: newPassword, DaysToPasswordChange: 15 }, (err, val) => {
            if (err) {
                res.send({ "Error": err.code })
                return next();
            }
            if (!val) {
                res.send({ "Error": "Error while updating the password" })
                return next();
            }
            res.send({ "Success": "OK" })
        })
    });
})

module.exports = {
    router
}