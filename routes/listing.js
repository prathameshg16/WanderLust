const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");  // Joi schema - serverside validation purpose
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const { populate } = require("../models/user.js");


// requiring the controller
const listingController = require("../controllers/listings.js");


//requiring the cloudinary and storage
const {storage} = require("../cloudConfig.js");


// requiring multer for multipart/form-data parsing
const multer = require("multer");
const upload = multer({storage});


//validation of schema - middleware
// for listings
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


// using router.route to restructuring the routes with same paths but different verbs
router
    .route("/")
    // index route - refer controllers folder - index func. 
    .get(wrapAsync(listingController.index)) 
    //create route - post - refer controllers folder - createListing func.
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing)); 

    // testing the image upload setup
    //.post(upload.single('listing[image]'),(req,res) => {
    //    res.send(req.file);
    //});



//new route - get - refer controllers folder - renderNewForm func. 
router.get("/new", isLoggedIn, listingController.renderNewForm);



// using router.route to restructuring the routes with same paths but different verbs
router
    .route("/:id")
    //show route - read - refer controllers folder - showListing func. 
    .get(wrapAsync(listingController.showListing))
    //update route - put - refer controllers folder - updateListing func.
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    //delete route - delete - refer controllers folder - destroyListing func.
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//edit route - get - refer controllers folder - renderEditForm func. 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;