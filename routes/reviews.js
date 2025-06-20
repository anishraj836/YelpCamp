const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressError');


const reviews = require('../controllers/reviews');
const {isReviewAuthor,validateReview,isLoggedIn} = require('../middleware');
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,reviews.deleteReview);
router.post('/', isLoggedIn,validateReview, reviews.createReview);
module.exports = router;