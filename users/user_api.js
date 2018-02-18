const router = require('express').Router();
const utils = require('../common/utils');
const models = require('./user_models')

const bp = require('body-parser')
router.use(bp.json());

router.get("/", (req, res) => {
    res.send("works!");
})

router.post("/addUser", (req, res) => {
    var email = req.body.email;

    if(utils.validateEmail(email)) {
        const randUUC = utils.randStr(6);
        const randPass = utils.randStr(10);

        var newUser = new models.UserModel({
            Email: email, 
            Password : randPass,
            UUC : randUUC,
            DaysToPasswordChange : 0
        });
        newUser.save()
        .then(() => {
            res.write(JSON.stringify({
                "Status" : "OK",
                "Email" : email,
                "UUC" : randUUC,
                "Password" : randPass
            }));
            res.end();
        })
        .catch((err) => {
            res.write(JSON.stringify({
                "Status" : "Error",
                "Code" : err.code
            }));
            res.end();
        });
    } else {
        res.write(JSON.stringify({
            "Status" : "Error",
            "Error" : "Doesn't Looks like an email"
        }));
        res.end();
    }
})

router.post("/changePassword", (req, res) => {
    var email = req.body.email;
    var oldPass = req.body.oldPassword;
    var newPass = req.body.newPassword;

    if(utils.validateEmail(email) && utils.validatePassword()) {
        models.UserModel.findOne({
            Email : email
        }, (err, user) => {
            if(err) {
                res.write("Error: " + err.code);
                res.end();
            } else {
                if(!user) {
                    res.write("Error: Incorrect User");
                    res.end();
                } else {
                    if(user.Password == oldPass) {
                        models.UserModel.update({
                            Email: email
                        }, {
                            Password: newPassword,
                            DaysToPasswordChange: 15
                        }, (err, val) => {
                            if(err) {
                                res.write("Error while updating: " + err.code);
                                res.end();
                            }
                        })
                    } else {
                        res.write("Error : Incorrect Password");
                        res.end();
                    }
                }
            }
        });

        var newUser = new models.UserModel({
            Email: email, 
            Password : randPass,
            UUC : randUUC,
            DaysToPasswordChange : 0
        });
        newUser.save()
        .then(() => {
            res.write(JSON.stringify({
                "Status" : "OK",
                "Email" : email,
                "UUC" : randUUC,
                "Password" : randPass
            }));
            res.end();
        })
        .catch((err) => {
            res.write(JSON.stringify({
                "Status" : "Error",
                "Code" : err.code
            }));
            res.end();
        });
    } else {
        res.write(JSON.stringify({
            "Status" : "Error",
            "Error" : "Doesn't Looks like an email"
        }));
        res.end();
    }
})

module.exports = {
    router
}