import { Listing } from "./models/listing.js";
import { Review } from "./models/reviews.js";
import { listingSchema } from "./schema.js";
import { ExpressError } from "./utils/ExpressError.js";
import { reviewSchema } from "./schema.js";
const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Login first, travel later!");
        return res.redirect("/login");
    }
    next();
}
const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
const isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.crtUsr._id)){
        req.flash("error","Nope! Your superpowers don’t extend here");
        return res.redirect(`/listings/${id}`);
    }
    next();
    
}
const isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.crtUsr._id)){
        req.flash("error","Nope! Your superpowers don’t extend here");
        return res.redirect(`/listings/${id}`);
    }
    next();
    
}
function validateListing(req,res,next){
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",")
        next(new ExpressError(400,errorMsg));
    }else{
        next();
    }
}

function vaildateReview(req,res,next){
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        next(new ExpressError(400,errorMsg));
    }else{
        next();
    }
}
export{isLoggedIn,saveRedirectUrl,isOwner,validateListing,vaildateReview,isAuthor};