import mongoose, { Schema } from "mongoose";
const reivewSchema = mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
const Review = mongoose.model("Review",reivewSchema);
export{Review}