function randStr(count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(pass) {
    if (pass.length < 6) return false;
    if (pass.search(/[a-z]/i) < 0) return false;
    if (pass.search(/[0-9]/) < 0) return false;
    if (pass.search(/[A-Z]/i) < 0) return false;
    return true;
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.sendStatus(401);
}

module.exports = {
    randStr,
    validateEmail,
    validatePassword,
    isLoggedIn
}