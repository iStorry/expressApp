module.exports = function (app, passport, LocalStrategy) {

    const bp = require('body-parser');
    const models = require("./users/user_models");
    const session = require("express-session");
    const utils = require("./common/utils");

    app.use(bp.urlencoded({ extended: true }) );

    app.use(session({
        secret: "tHiSiSasEcRetStr",
        resave: true,
        saveUninitialized: true 
    }));
    
    passport.use('local-login', new LocalStrategy(
        function (username, password, done) {
            models.UserModel.findOne({ UUC: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        models.UserModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());    

    app.get("/", function (req, res) {
        res.send("Hello!");
    });
     
    // api endpoints for login, content and logout
    app.get("/login", function (req, res) {
        res.send(
            "<p>Please login!</p>\
            <form method='post' action='/login'>\
                <input type='text' name='username'/>\
                <input type='password' name='password'/>\
                <button type='submit' value='submit'>Submit</buttom>\
            </form>");
    });
    app.post("/login", 
        passport.authenticate("local-login", { failureRedirect: "/loginaaaa"}),
        function (req, res) {
            res.redirect("/content");
    });
    app.get("/content", utils.isLoggedIn, function (req, res) {
        res.send("Congratulations! you've successfully logged in.");
    });
    app.get("/logout", function (req, res) {
        req.logout();
        res.send("logout success!");
    });
    
}