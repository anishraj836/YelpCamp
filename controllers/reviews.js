const {campgroundSchema,reviewSchema} = require('../schemas.js');
const campground = require('../models/campground');
const Review = require('../models/review');
module.exports.createReview = async (req,res)=>{
    const Campground = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash('success','Created New Review');
    res.redirect(`/campgrounds/${Campground._id}`);
};
module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    campground.findByIdAndUpdate(id,{$pull: reviewId});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
};