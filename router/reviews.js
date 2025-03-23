const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAysnc = require("../utils/wrapAysnc.js");
const ExpressError = require("../utils/expressError.js");

const Review = require("../models/review.js");
const {validatereviews, isLoggedIn, isAuthor} = require("../middleware.js");



// new Review
router.post("/",isLoggedIn,validatereviews, wrapAysnc (async( req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let  newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listing/${listing._id}`);
}));

//deleting Reviews
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAysnc(async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId) ;
    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
}))

module.exports = router 