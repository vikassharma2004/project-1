const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utility/expresserror.js");
const { listingSchema, reviewSchema } = require("./schema.js");
module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirecturl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curruser._id)) {
    req.flash("error", "you are not the owner ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// Middleware: Check if the user is the owner of the review
module.exports.isReviewOwner = async (req, res, next) => {
  try {
    const { id, reviewid } = req.params;

    // Assuming Review is the model for reviews, find the review by ID
    const review = await Review.findById(reviewid);

    // Check if the review exists and if the current user is the author
    if (
      !review ||
      (review.author && !review.author.equals(res.locals.curruser._id))
    ) {
      req.flash("error", "You are not the owner of the review");
      return res.redirect(`/listings/${id}`);
    }

    // If the review exists and the current user is the author, proceed
    next();
  } catch (err) {
    // Handle any errors that occur during the process
    next(err);
  }
};

// Middleware for validating listing data
module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};
// Middleware for validating review data
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(404, errmsg);
  } else {
    next();
  }
};
