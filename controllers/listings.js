const Listing = require("../models/listing.js");
const axios = require("axios");                 // for geocoding - using maps 


// callback fun. of index route (get method)
module.exports.index = async(req,res,next)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


// callback func. of new route - create new listing (get method)
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};


// callback func. of show route - show individual listing (get method)
module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author",},}).populate("owner");//listing owner & review authorization
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


// callback func. of create route - create listing (post method)
module.exports.createListing = async(req,res,next)=>{
        //let {title,description,image,price,location,country} = req.body;

        // using maps - geocoding - using nomintam for geocoding(coordinates)
        const response = await axios.get("https://nominatim.openstreetmap.org/search",
            {
                params: {
                q: req.body.listing.location,
                format: "json",
                limit: 1,
                },
                headers: {
                    "User-Agent": "WanderLust/1.0"
                }
            }
        );

        //modify image in schema
        let url = req.file.path;
        let filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;                    //listing owner
        newlisting.image = { url, filename };               //modify image in schema
        
        // storing coordinates - geocoding
        if (response.data.length > 0) {
            newlisting.geometry = {
                type: "Point",
                coordinates: [
                    parseFloat(response.data[0].lon), // longitude first
                    parseFloat(response.data[0].lat), // latitude second
                ],
            };
        }

        await newlisting.save();
        req.flash("success","New Listing created!");
        res.redirect("/listings");
};


// callback func. of create route - edit listing (get method)
module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }

    //image preview transformation for edit page
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};


// callback func. of create route - update listing (put method)
module.exports.updateListing = async (req,res,next)=>{
    //console.log(req.body);
    let {id} = req.params;

    // Geocode location using Nominatim
    const response = await axios.get("https://nominatim.openstreetmap.org/search",
        {
                params: {
                q: req.body.listing.location,
                format: "json",
                limit: 1,
                },
                headers: {
                    "User-Agent": "WanderLust/1.0",
                },
        }
    );

    if (response.data.length > 0) {
        req.body.listing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(response.data[0].lon),
                parseFloat(response.data[0].lat),
            ],
        };
    }
    

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    //modify image in schema - edit image listing
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};


// callback func. of create route - delete listing (delete method)
module.exports.destroyListing = async (req,res,next)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};