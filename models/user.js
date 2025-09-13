import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const usrSch = mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
usrSch.plugin(passportLocalMongoose);
const User = mongoose.model("User",usrSch);
export {User}