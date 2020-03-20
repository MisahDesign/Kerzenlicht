const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require ("../middleware");

 // USER PROFILE
router.get("/profile", middleware.isLoggedIn, function(req, res){
    res.render("profile.ejs");
});

// LOGOUT LOGIC 
router.get("/logout", middleware.isLoggedIn, function (req, res){
    req.logout();
    res.redirect("/");
});

router.use('/', middleware.notLoggedIn, function(req, res, next){
    next();
});

router.get("/register", function(req, res){
    var messages = req.flash('error');
    res.render("register.ejs", {messages: messages, hasErrors: messages.length > 0});
});
  
  
  
router.post("/register", passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/register',
    failureFlash: true
}));
  
  
  
  // LOGIN FORM
router.get("/login", function(req, res){
    var messages = req.flash('error');
    res.render("login.ejs", {messages: messages, hasErrors: messages.length > 0});
});
  
 
  
  //  LOGIN LOGIC
router.post("/login", passport.authenticate("local.signin",
    {
      successRedirect: "/user/profile",
      failureRedirect: "/user/login",
      failureFlash: true
    }));
  
  

module.exports = router;
  
  