function randStr(count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < count; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function validateEmail(email) {
    return true;
}
function validatePassword(pass) {

}

module.exports = {
    randStr,
    validateEmail,
    validatePassword
}