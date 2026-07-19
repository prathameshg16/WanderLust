const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


// to authenticate the users
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;      // redirectUrl save - for post login page
        req.flash("error","You must be logged-in to create lisitng!");
        return res.redirect("/login");
    }
    next();
};


//post-login page
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirecturl){
        res.locals.redirectUrl = req.session.redirecturl;
    }
    next();
};


//authorization for listings - using middleware
module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


//authorization for reviews - using middleware
module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};