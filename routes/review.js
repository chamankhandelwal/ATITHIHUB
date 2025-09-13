import express from "express";
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn,vaildateReview,isAuthor} from "../middleware.js"
import { createReview,deleteReview } from "../controllers/review.js";
const router = express.Router({ mergeParams: true });
router
    .route("/")
    .get(isLoggedIn, (req, res) => {
    let { id } = req.params;
    res.redirect(`/listings/${id}`);
        })
    .post(isLoggedIn,vaildateReview,wrapAsync(createReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(deleteReview));
export{router}