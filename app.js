import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import {dirname} from "path";
import methodOveride from "method-override";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/ExpressError.js";;
import { router as listings } from "./routes/listings.js";
import { router as reviews } from "./routes/review.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local"
import { User } from "./models/user.js";
import { router as user} from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000; 
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOveride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
let dbUrl = process.env.ATLASURL;
async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("connection success.");
})
.catch((err)=>{
    console.log(err);
})
app.listen(port,()=>{
    console.log(`Server is listing at`,port);
});
const store = MongoStore.create({
    mongoUrl :dbUrl,
    crypto:{
        secret:'iamironman'
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in store session",err);
})
let sessionOptions={
    store, 
    secret:"iamironman",
    resave:false,
    saveUninitialized:true,
    httpOnly:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, //2025-09-17T10:52:49.674Z
        maxAge:7*24*60*60*1000
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async(req,res)=>{
//     let newUser = new User({
//         email:"demo@mail",
//         username:"yugo.yug"
//     });
//    let regUsr= await User.register(newUser,"Qwert");
//    res.send(regUsr);

// })
app.use((req,res,next)=>{
    res.locals.msg = req.flash("success");
    res.locals.msgDel = req.flash("delete");
    res.locals.msgErr = req.flash("error");
    res.locals.crtUsr= req.user;
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/",user);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    
    let {statusCode=500,message="Something went wrong..."} = err;
    res.status(statusCode).render("error.ejs",{message});
})