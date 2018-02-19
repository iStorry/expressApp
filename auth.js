module.exports = function (app, passport, LocalStrategy) {

    const bp = require('body-parser');
    const session = require("express-session");
    const models = require("./users/user_models");
    const utils = require("./common/utils");

    app.use(bp.urlencoded({ extended: true }));
    app.use(bp.json());

    app.use(session({
        secret: "HelloUpStox",
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
        res.send("Hello UpStox!");
    });
     
    app.post("/login", 
        passport.authenticate("local-login", { failureRedirect: "/login"}),
        function (req, res) {
            res.send("Authenticated User :" + req.user.UUC);
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.send("logout success!");
    });
    
}