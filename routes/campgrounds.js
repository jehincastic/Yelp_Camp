var express     = require('express'),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require('../middleware');

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds : allCampgrounds, page: 'campgrounds'});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, image: image, description : description, author: author, price : price};
    Campground.create(newCampGround, function(err, campground){
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Campground added successfully.");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});

router.get("/:id/edit", middleware.checkCampgroundOwenship, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash("error", "Campground not found.");
        }
        else {
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwenship, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campground");
        }
        else {
            req.flash("success", "Campground updated successfully.");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwenship, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Campground deleted successfully.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;