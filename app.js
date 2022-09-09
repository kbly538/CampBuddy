const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const expressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const catchAsync = require("./utils/catchAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const User = require("./models/user");
const { url } = require("inspector");
const { redirectBack } = require("./middleware");



//db
mongoose.connect("mongodb://127.0.0.1:27017/CampBuddy");


const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to db");
});
db.on("error", (err) => {
  console.log(err);
  console.log("Connection error");
});

// init
const app = express();

//templating
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parsing
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("public", path.join(__dirname, "public"));

//Logging
app.use(morgan("tiny"));

const sessionConfig = {
  secret: "thisshouldbeasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    exprires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(redirectBack)

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = [
    { success: req.flash("success"), danger: req.flash("error") },
  ];
  next();
});

//Routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});

//Error handlers
app.all("*", (req, res, next) => {
  next(new expressError("Page not found", 501));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong";
  res.status(statusCode).render("error", { err });
});

// connection
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
