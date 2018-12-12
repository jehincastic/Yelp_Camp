var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require('passport'),
    LocalStrategy       = require("passport-local"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds"),
    commentRoutes       = require("./routes/comments"),
    methodOverride      = require("method-override"),
    flash               = require('connect-flash'),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

// seedDB();
app.use(flash());
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
    secret: "Once again you are logged in.",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser  = req.user;
    res.locals.error      = req.flash('error');
    res.locals.success      = req.flash('success');
    next();
});

    app.use(indexRoutes);
    app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3600, 'localhost', function() {
    console.log("YelpCamp Server Has Started");
});