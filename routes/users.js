const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      await User.register(user, password);
      req.flash("success", "Welcome");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back");
    console.log("AL SANA PREV", res.locals.previousUrl);
    res.redirect(res.locals.previousUrl);
  }
);

router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("success", "Goodbye!");
    return res.redirect("/campgrounds");
  }
});

module.exports = router;
