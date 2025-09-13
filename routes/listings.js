import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn ,isOwner,validateListing} from "../middleware.js";
import { index ,renderNewForm,showListings,createListings,editListing,updateListings,deleteListing} from "../controllers/listing.js";
import multer from "multer";
import { cloudinary,storage } from "../cloudConfig.js";
const upload = multer({storage});
router
    .route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(createListings));

// new 
router.get("/new",isLoggedIn,renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(showListings))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(updateListings))
    .delete(isOwner,isLoggedIn,wrapAsync(deleteListing));

// edit
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(editListing));

export{router}