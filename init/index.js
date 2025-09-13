import mongoose from "mongoose";
import{initData} from "./data.js";
import {Listing} from "../models/listing.js"; 
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/atithihub');
}
main()
.then((res)=>{
    console.log("connection success.");
})
.catch((err)=>{
    console.log(err);
})
const initDb= async ()=>{
    // await Listing.deleteMany({});
    const listingOwner = initData.map((obj)=>({...obj,owner:"68c2c5d331072b41b4c70524",}));
    await Listing.insertMany(listingOwner);
    console.log("data inserted")
}
initDb();