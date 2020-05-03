var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")



//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
                res.render("comments/new", {campground: foundCampground});


        }
    })
});



//Comments create

router.post("/", function(req, res){

       Campground.findById(req.params.id, function(err, foundCampground){ //check this adding middleware then we cant post comment
        if(err){
                req.flash("error", "Comment could not be ");_
                redirect("/campgrounds");
        } else {
                console.log(req.body.comment)
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        console.log(err)
                    } else {
                        //add username and id to comment
                        //save comment
                        comment.author.id  = req.user._id
                        comment.author.username = req.user.username
                        comment.save();
                        foundCampground.comments.push(comment);
                        foundCampground.save();
                        req.flash("success", "Successfully added comment")
                        res.redirect("/campgrounds/" + foundCampground._id);

                    }
                })


        }
    })

});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Cannot find campground ")
            return res.redirect("back")
        }
    })
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
            }
        });

});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })

});

//Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //Remove Comment
    Comment.findByIdAndRemove(req.params.comment_id,  function(err){
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "comment successfully removed")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//middleware





module.exports = router;
