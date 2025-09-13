import { User } from "../models/user.js";
const signupForm=(req,res)=>{
    res.render("users/user.ejs");
};
const signup=async(req,res)=>{
    try{let {username,email,password}=  req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Atithihub!");
        res.redirect("/listings");
    })

    }
    catch(err){
        req.flash("delete",err.message);
        res.redirect("/signup");
    }
    
    
};
const loginForm =(req,res)=>{
    res.render("users/login.ejs")
}
const login =  async(req,res)=>{
    req.flash("success","Welcome back to Atithihub!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};
const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","You have successfully logged out.");
        res.redirect("/listings");
    })
}
export{signupForm,signup,loginForm,login,logout}