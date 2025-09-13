import { Listing } from "../models/listing.js";
const index = (async(req,res)=>{
    let allListings = await Listing.find()
    res.render("listings/index.ejs",{allListings});
});
const renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}
const showListings = (async(req,res)=>{
    let {id}=req.params;
    try{
    let listing = await Listing.findById(id).populate({path:"review",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("delete","Not found!"); 
        return res.redirect("/listings");
    }
    let MAP_TOKEN = process.env.MAP_TOKEN;
    res.render("listings/show.ejs",{listing,MAP_TOKEN});
    }catch(err){
        console.log(err);
    }
});

const createListings=(async(req,res,next)=>{
    let url = req.file.path
    let filename =req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    await newListing.save();
    req.flash("success","New listing added!");
    res.redirect("/listings");
    
});

const editListing = (async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let orignialImageUrl = listing.image.url;
    orignialImageUrl = orignialImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,orignialImageUrl})
});

const updateListings = (async(req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename}
        await listing.save();
    }
    req.flash("success","Listing updated sucessfully!");
    res.redirect(`/listings/${id}`)
});

const deleteListing = (async(req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findByIdAndDelete(id);
    req.flash("delete","Listing deleted sucessfully!");
    res.redirect("/listings");
});
export {index,renderNewForm,showListings,createListings,editListing,updateListings,deleteListing}