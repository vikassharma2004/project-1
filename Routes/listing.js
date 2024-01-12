const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapasync = require("../utility/wrapasync.js");
const ExpressError = require("../utility/expresserror.js");
const multer=require("multer")
const {storage}=require("../cloudconfig.js");
const upload=multer({storage})
const { listingSchema, reviewSchema } = require("../schema.js");

const {
  isloggedin,
  isowner,
  validatelisting,
  validatereview,
} = require("../middleware.js");
const controller = require("../controllers/listings.js");

// Index route - Displays all listings
router.get("/", wrapasync(controller.index));

// New route - Renders form for creating a new listing
router.get("/new", isloggedin, controller.RenderNewform);

// Individual show route - Displays details of a specific listing
router.get("/:id", wrapasync(controller.showlisting));

// Create route - Creates a new listing
router.post(
  "/",
  isloggedin,
  upload.single("listing[image]"),
  validatelisting,
  wrapasync(controller.createlisting)

  
);
// router.post(
//   "/",
//   upload.single('listing[image]'),
//   validatelisting,
//   isloggedin,
//   wrapasync(controller.createlisting)
// );

// Update route - Edits an existing listing
router.get(
  "/:id/edit",
  isloggedin,
  isowner,
  wrapasync(controller.rendereditform)
);

router.put(
  "/:id",
  isloggedin,
  isowner,
  upload.single("listing[image]"),
  validatelisting,
  wrapasync(controller.updatelisting)
);

// Delete route - Deletes a listing
router.delete("/:id", isloggedin, isowner, wrapasync(controller.deletelisting));

module.exports = router;
