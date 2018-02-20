module.exports = function (app, passport, LocalStrategy) {

    const bp = require('body-parser');
    const session = require("express-session");
    const userModel = require("../users/user_models").UserModel;
    const utils = require("../common/utils");

    app.use(bp.urlencoded({ extended: true }));
    app.use(bp.json());

    app.use(session({
        secret: "HelloUpStox",
        resave: true,
        saveUninitialized: true 
    }));
    
    // Creating a new custom passport strategy to use our database to verify credentials.
    passport.use('local-login', new LocalStrategy(
        function (username, password, done) {
            userModel.findOne({ UUC: username }, function (err, user) {
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
        userModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());    

    /*
        Path : "/"
        Method : Get
        Params : None
        Response : Hello Upstox!
        Description : Just a method for testing
    */
    app.get("/", function (req, res) {
        res.send("Hello UpStox!");
    });
     
    /*
        Path : "/login"
        Method : Post
        Params : { "username" : "SomeUUC", "password" : "SomePassword" }
        Response : "Authenticated User : SomeUUC"
        Description : User login API
    */
   app.post("/login", 
        passport.authenticate("local-login", { failureRedirect: "/login"}),
        function (req, res) {
            res.send("Authenticated User :" + req.user.UUC);
    });

    /*
        Path : "/logout"
        Method : Get
        Params : None
        Response : "logout success"
        Description : User logout API
    */
   app.get("/logout", function (req, res) {
        req.logout();
        res.send("logout success!");
    });
    
}