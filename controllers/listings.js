const Listing = require("../models/listing");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const accestoken = process.env.MAP_TOKEN;

const geocodingClient = mbxgeocoding({ accessToken: accestoken });

// stylesService exposes listStyles(), createStyle(), getStyle(), etc.
module.exports.index = async (req, res) => {
  const AllListing = await Listing.find({});
  res.render("listings/index.ejs", { AllListing });
};

module.exports.RenderNewform = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  //  populate is used to bring th einfo of  reviews
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exit");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createlisting = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  let newlisting = new Listing(req.body.listing); //  jb bhi listing create ho toh uske andar user id store ho jaye
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savedlisting = await newlisting.save();
  req.flash("sucess", "New Listing Created");
  res.redirect("/listings");
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exit");
    res.redirect("/listings");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalimageurl });
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("sucess", "updated");
  res.redirect("/listings");
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deletedlistings = await Listing.findByIdAndDelete(id);
  req.flash("sucess", "Listing deleted");
  res.redirect("/listings");
};
