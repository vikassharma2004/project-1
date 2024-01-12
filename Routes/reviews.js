const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utility/wrapasync.js");
const ExpressError = require("../utility/expresserror.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {
  isloggedin,
  validatereview,
  saveredirecturl,
  isReviewOwner,
} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

// / Route to add a review to a listing
router.post(
  "/",
  isloggedin,
  validatereview,
  saveredirecturl,
  wrapasync(reviewcontroller.createreview)
);
// Route to delete a review from a listing
router.delete(
  "/:reviewId",
  isloggedin,
  wrapasync(reviewcontroller.deletereview)
);

module.exports = router;
