const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 passport.use(new LocalStrategy(User.authenticate()));

 passport.serializeUser(function(user, done){
     done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
     User.findById(id, function(err, user){
         done(err, user);
     });
 });

 passport.use('local.signup', new LocalStrategy({
     usernameField:'username',
     passwordField: 'password',
     passReqToCallback: true
 }, function(req, username, password, done) {
     req.checkBody('username', 'Invalid username').notEmpty().isLength({min:4});
     req.checkBody('password', 'Invalid Password').notEmpty().isLength({min:4});
     var errors = req.validationErrors();
     if (errors){
         var messages = [];
         errors.forEach(function(error){
             messages.push(error.msg);
         });
         return done(null, false, req.flash('error', messages));
     }
     User.findOne({'username': username}, function(err, user) {
         if (err) {
             return done(err);

         }
         if (user) {
             return done(null, false, {message: 'Benutzername ist bereits vergeben.'});
         }
         var newUser = new User();
             newUser.username = username;
             newUser.password = newUser.encryptPassword(password);
             newUser.save(function(err, result) {
                 if (err) {
                     return done(err);
                 }
                 return done(null, newUser);
             });
     });
 }));

 passport.use("local.signin", new LocalStrategy({
     usernameField: 'username',
     passwordField: 'password',
     passReqToCallback: true
 }, function(req, username, password, done){
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid Password').notEmpty();
    var errors = req.validationErrors();
    if (errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function(err, user) {
        if (err) {
            return done(err);

        }
        if (!user) {
            return done(null, false, {message: 'Benutzername konnte nicht gefunden werden.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Falsches Passwort.'})
        }
        return done(null, user);
    });
 }));