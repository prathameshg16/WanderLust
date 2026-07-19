const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


//requiring controllers
const userController = require("../controllers/users.js");



// using router.route to restructuring the routes with same paths but different verbs
router
    .route("/signup")
    //get route - signup process - refer controllers folder - renderSignupForm func.
    .get(userController.renderSignupForm)
    //post route - signup process - refer controllers folder - signup func.
    .post(wrapAsync(userController.signup));



// using router.route to restructuring the routes with same paths but different verbs
router
    .route("/login")
    //get route - login process - refer controllers folder - renderLoginForm func.
    .get(userController.renderLoginForm)
    //post route - login process - refer controllers folder - login func.
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}), userController.login);



//get route - logout process - refer controllers folder - logout func.
router.get("/logout",userController.logout);



module.exports = router;