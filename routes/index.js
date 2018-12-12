var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

router.post("/register", (req, res) => {
    var newUser = new User({username : req.body.username}); 
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Registered successfully, welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


router.post("/login", passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), (req, res) => {});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged You Out!');
    res.redirect("/campgrounds");
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
 //show login form
 router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
 });

module.exports = router;