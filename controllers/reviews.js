const Listing = require("../models/listing.js");   //importing or requirering the lisitng model
const Review = require("../models/review.js");   //importing or requirering the review model


// callback func. of create review route (post method)
module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};


// callback func. of delete review route (delete method)
module.exports.destroyReview = async(req,res,next) =>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};