const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");  // Joi schema - serverside validation purpose
const Review = require("../models/review.js");   //importing or requirering the review model
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");      //for authenticating & authorization the user


// requiring the controller
const reviewController = require("../controllers/reviews.js");


//validation of schema - middleware
// for reviews
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//reviews route - refer controllers folder - createReview func.
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// delete review route - refer controllers folder - deleteReview func.
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;