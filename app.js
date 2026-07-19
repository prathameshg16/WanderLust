if(process.env.NODE_ENV != "production"){  // means while deploying the project or uploading on github it will not deploy the .env file
    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// session options we'll be using
const sessionOptions = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const port  = 8080;
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";



//joining views and app for ejs templating
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


//connecting to mongodb using mongoose
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}


//listening the app or starting the app
app.listen(port,()=>{
    console.log("Server listening on port 8080");
});



//root route
//app.get("/",(req,res)=>{
//    res.send("Hi , I am root");
//});



//using session
app.use(session(sessionOptions));
app.use(flash());



//configuring strategy - passport - authentication & authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// using connect-flash & res.locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");      // for flash messages
    res.locals.error = req.flash("error");          // for flash messages
    res.locals.currUser = req.user;                 // for signup,login,logout processes (in navbar.ejs check for it)
    next();
});



/*
//demo user 
app.get("/demouser",async(req,res)=>{
    let fakeuser = new User({
        email : "abc@gmail.com",
        username : "Abc-def",
    });
    let registeredUser = await User.register(fakeuser,"helloworld");
    res.send(registeredUser);
});*/


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//testing error - sample route 
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});



//custom error handler & custom ExpressError
app.use((err,req,res,next)=>{
    let {status = 500 , message = "Something went wrong!"} = err; 
    res.status(status).render("error.ejs",{err});
    //res.status(status).send(message);
});





// just for testing wether the db is connected and stores all
/*app.get("/testlisting",async (req,res)=>{
    let sampleListing = new Listing({
        title:"My New Villa",
        description:"Beachside property",
        price:10000,
        location:"Varkala",
        country:"India",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful testing");
});*/