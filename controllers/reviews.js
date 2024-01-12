const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("sucess", "Review created");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.deletereview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("sucess", "deleted review");
  res.redirect(`/listings/${id}`);
};
