const express = require('express');
const utils = require('./Utils');
const models = require('./stock_models');
const bp = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
  
passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, (err, user) => {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }
));
  

function findByUsername(ucc, cb) {
    process.nextTick(function() {
        models.UserModel.findOne( {UCC : ucc}, (err, user) => {
            cb(err, user);
        } )
    });
};