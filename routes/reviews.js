const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    return next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    console.log(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Your review has been added")
    res.redirect(`/campgrounds/${camp._id}`);
  })
  );
  
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    req.flash("success", "Your review has been deleted.")
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
