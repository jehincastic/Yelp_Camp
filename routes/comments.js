var express = require('express'),
    router  = express.Router({mergeParams : true}),
    Campground  = require("../models/campground"),
    middleware  = require('../middleware'),
    Comment    = require("../models/comment");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});            
        }
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, (er, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "No Campground Found.");
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, comment) => {
            if(err || !comment) {
                req.flash("error", "Comment not found.");
                res.redirect('back');
            }
            else {
                res.render("comments/edit", {campground_id : req.params.id, comment : comment});
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back");
            console.log(err);
        }
        else {
            req.flash("success", "Successfully updated comment.");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully deleted comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;