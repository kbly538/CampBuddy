module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

let urlList = [];
let previousUrl = "";

module.exports.redirectBack = (req, res, next) => {
  if (req.url !== "/favicon.ico" && urlList.length < 3) {
    urlList.push(req.url);
    if (urlList.length === 3) {
      res.locals.previousUrl = urlList.shift();
      previousUrl = res.locals.previousUrl;
    }
  }
  next();
};
