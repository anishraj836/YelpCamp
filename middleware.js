const {campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const campground = require('./models/campground');
const review = require('./models/review');
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must log in first');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(', ');
        console.log(msg);
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const Campground = await campground.findById(id);
    if(!Campground.author.equals(req.user._id)){
        req.flash('error','You don`t have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const Review = await review.findById(reviewId);
    if(!Review.author.equals(req.user._id)){
        req.flash('error','You don`t have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error)
        {
            const msg = error.details.map(el=>el.message).join(', ');
            console.log(msg);
            throw new ExpressError(msg, 400);
        }
        else{
            next();
        }
}