const User = require("../models/user.js");


// callback func. of signup form route (get method)
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}


// callback func. of signup route (post method)
module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);

        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


// callback func. of login form route (get method)
module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};


// callback func. of login route (post method)
module.exports.login = async(req,res) =>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";        //for post-login page
    res.redirect(redirectUrl);                                      // for post-login page
};


// callback func. of logout route (get method)
module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged-out");
        res.redirect("/listings");
    });
};