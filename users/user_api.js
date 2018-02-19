const router = require('express').Router();
const utils = require('../common/utils');
const models = require('./user_models')

router.get("/", (req, res) => {
    res.send("User module!");
})

router.post("/addUser", (req, res, next) => {
    var email = req.body.Email;

    if (!utils.validateEmail(email)) {
        res.send({ "Error": "Doesn't Looks like an email" });
        return next();
    }

    const randUUC = utils.randStr(6);
    const randPass = utils.randStr(10);

    var newUser = new models.UserModel({
        Email: email,
        Password: randPass,
        UUC: randUUC,
        DaysToPasswordChange: 0
    });
    newUser.save()
        .then(() => {
            res.send({
                "Status": "OK",
                "Data" : {
                    "Email": email,
                    "UUC": randUUC,
                    "Password": randPass
                }
            });
        })
        .catch((err) => {
            res.send({
                "Status": "Error",
                "Code": err.code
            });
        });
})

router.post("/changePassword", (req, res, next) => {
    var email = req.body.Email;
    var oldPass = req.body.OldPassword;
    var newPass = req.body.NewPassword;
    var confirmPass = req.body.ConfirmPassword;

    if(newPass != confirmPass) {
        res.send({
            "Error" : "New Password and Confirm Password do not match"
        });
        next();
    }

    if (utils.validateEmail(email) && utils.validatePassword()) {
        models.UserModel.findOne({
            Email: email
        }, (err, user) => {
            if (err) {
                res.send({ "Error" : err.code });
                next();
            }
            if (!user) {
                res.send({ "Error" : "Incorrect User" });
                next();
            }
            if (user.Password == oldPass) {
                models.UserModel.update({
                    Email: email
                }, {
                        Password: newPassword,
                        DaysToPasswordChange: 15
                    }, (err, val) => {
                        if (err) {
                            res.write("Error while updating: " + err.code);
                            res.end();
                        }
                    })
            } else {
                res.write("Error : Incorrect Password");
                res.end();
            }
        });

        var newUser = new models.UserModel({
            Email: email,
            Password: randPass,
            UUC: randUUC,
            DaysToPasswordChange: 0
        });
        newUser.save()
            .then(() => {
                res.write(JSON.stringify({
                    "Status": "OK",
                    "Email": email,
                    "UUC": randUUC,
                    "Password": randPass
                }));
                res.end();
            })
            .catch((err) => {
                res.write(JSON.stringify({
                    "Status": "Error",
                    "Code": err.code
                }));
                res.end();
            });
    } else {
        res.write(JSON.stringify({
            "Status": "Error",
            "Error": "Doesn't Looks like an email"
        }));
        res.end();
    }
})

module.exports = {
    router
}