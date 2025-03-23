
const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const {  reviewSchema } = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "  You must be login");
        return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    };
    next();
};

module.exports.validateListing =(req , res, next)=>{
    let {error}  = listingSchema.validate(req.body);
    if(error){
        let errMag = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,  errMag); 
    }else{
        next();
    }
};

module.exports.validatereviews =(req , res, next)=>{
    let {error}  = reviewSchema.validate(req.body);
    if(error){
        let errMag = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,  errMag); 
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let reviews = await Review.findById(reviewId)
    if (!reviews.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listing/${id}`);
    };
    next();
};
