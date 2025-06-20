const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');



router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampgrounds));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))


router.route('/:id')
.get( catchAsync(campgrounds.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.destroy));

module.exports = router;