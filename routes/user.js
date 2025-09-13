import express from "express";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js"
import { signupForm,loginForm,signup,login,logout} from "../controllers/user.js";
import { wrapAsync } from "../utils/wrapAsync.js";
const router = express.Router();
router
    .route("/signup")
    .get(signupForm)
    .post(wrapAsync(signup));

router
    .route("/login")
    .get(loginForm)
    .post(saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true
    }
),login);

router.get("/logout",logout);
export{router}