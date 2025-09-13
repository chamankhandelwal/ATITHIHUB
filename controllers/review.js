import { Listing } from "../models/listing.js"
import { Review } from "../models/reviews.js";
const createReview=(async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review created!");
    res.redirect(`/listings/${id}`);
});
const deleteReview = (async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("delete","Review deleted!");
    res.redirect(`/listings/${id}`);
});
export{createReview,deleteReview}