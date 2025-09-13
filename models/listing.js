import mongoose, { Schema } from "mongoose";
import { Review } from "./reviews.js";
import { User } from "./user.js";;
const listingSch = mongoose.Schema({
    title:{
        type:String,
    },
    description:String,
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        // set:(v)=>v===""?"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60":v
    },
    price:Number,
    location:String,
    country:String,
    review:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
})
listingSch.post("findOneAndDelete",async(listing)=>{
    if(listing.review.length){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
});
const Listing = mongoose.model("Listing",listingSch);
export{Listing};