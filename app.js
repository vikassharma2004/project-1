if(process.env.NODE_ENV !="production"){

  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressError = require("./utility/expresserror.js");
//  routes
const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/reviews.js");
const userRouter=require("./Routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');

const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");
const flash = require("connect-flash");

//  passsport
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

const dburl=process.env.ATLAS_DB;
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("error in mongo session store",error)
})
const sessionoption = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveuninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httponly: true,
  },
};




//  session use
app.use(session(sessionoption));
app.use(flash());
//  jb bhi request aaye toh passport ko initilize krde hum
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // user se related info save krne ke liye session me
passport.deserializeUser(User.deserializeUser()); // user se related info hatane ke liye session se

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

// Establish database connection


main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

// Express app setup
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const path = require("path");
app.set("view engine", "ejs");
const ejsmate = require("ejs-mate");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsmate);
const wrapasync = require("./utility/wrapasync.js");
const { error } = require("console");

// Start server
app.listen(8080, () => {
  console.log("Server started");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User({
//     email: "vikasshar@gmailcom",
//     username: "viaks",
//   });
//   //  store krwane ke liye user ka register method use krege uske andar phele toh user jayega aur phir second argument jayega password
//   let registeruser=await User.register(fakeuser,"helloworld")
// res.send(registeruser )
// });

//  appling the concept of routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Handling 404 errors for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { err });
});
//   yaha ek problem aayi thi jb ye request ja rahi thi tb id nhi ja rahi hti listing ki  toh router ki andar merge params mehtod ki value true krni padhi

// Handling 404 errors for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { err });
});
