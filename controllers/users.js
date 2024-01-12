const User = require("../models/user");
module.exports.rendersignupform = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("error", "Username is already taken");
      return res.redirect("/signup");
    }

    const newuser = new User({ email, username });
    const registereduser = await User.register(newuser, password);
    //  login after sign up
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("sucess", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = (req, res) => {
  let { username } = req.body;
  req.flash("sucess", `welcome  ${username}`);
  //  check kr rahe hai agr url empty hai toh home page pr jo else origina;url
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("sucess", " logged out");
    res.redirect("/listings");
  });
};
