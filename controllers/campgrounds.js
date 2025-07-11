const campground = require('../models/campground');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const {cloudinary} = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campgrounds/index',{campgrounds,mapTilerApiKey: process.env.MAPTILER_API_KEY});
};
module.exports.renderNewForm = (req,res)=>{
    if(!req.isAuthenticated())
    {
        req.flash('error','you must be signed in');
        res.redirect('/login');
    }
    else
    res.render('campgrounds/new');
}
module.exports.createCampgrounds = async (req,res,next)=>{
    // if(!req.body.Campground) throw new ExpressError('Invalid Campground data', 400);
    
    // Add this before any Joi validation (e.g., in createCampgrounds and updateCampground):
    if (
      req.body.Campground &&
      req.body.Campground.geometry &&
      req.body.Campground.geometry.coordinates &&
      typeof req.body.Campground.geometry.coordinates === 'object' &&
      !Array.isArray(req.body.Campground.geometry.coordinates)
    ) {
      const coordsObj = req.body.Campground.geometry.coordinates;
      req.body.Campground.geometry.coordinates = [
        parseFloat(coordsObj[0]),
        parseFloat(coordsObj[1])
      ];
    }
    
    // Use coordinates from map marker instead of geocoding
    const Campground = new campground(req.body.Campground);
    
    // Set geometry from form coordinates (from map marker)
    if (req.body.Campground.geometry && req.body.Campground.geometry.coordinates) {
        Campground.geometry = {
            type: 'Point',
            coordinates: [
                parseFloat(req.body.Campground.geometry.coordinates[0]),
                parseFloat(req.body.Campground.geometry.coordinates[1])
            ]
        };
    } else {
        // Fallback to geocoding if no coordinates provided
        const geoData = await maptilerClient.geocoding.forward(
            req.body.Campground.location, 
            { limit: 1 }
        );
        Campground.geometry = geoData.features[0].geometry;
    }
    
    Campground.images = req.files.map(f=>({url: f.path, filename: f.filename}));
    Campground.author = req.user._id;
    await Campground.save();
    req.flash('success','Successfully made a new Campground!');
    res.redirect(`/campgrounds/${Campground.id}`);
};
module.exports.showCampground = async (req,res)=>{
    const {id} = req.params;
    const Campground = await campground.findById(id).populate({
        path: 'reviews',populate: {
            path: 'author'
        }}).populate('author');
    if(!Campground)
        {
        req.flash('error','Campground not found');
        res.redirect('/campgrounds');
    }
    else
    res.render('campgrounds/show', {Campground, mapTilerApiKey: process.env.MAPTILER_API_KEY});
};
module.exports.renderEdit = async (req,res)=>{
    const {id} = req.params;
    const Campground = await campground.findById(id);
    if(!Campground){
        req.flash('error','Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    else
    res.render('campgrounds/edit', {Campground, mapTilerApiKey: process.env.MAPTILER_API_KEY});
};
module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params;
    // Ensure coordinates are an array if present (already handled by middleware)
    let geometry = null;
    if (
      req.body.Campground &&
      req.body.Campground.geometry &&
      Array.isArray(req.body.Campground.geometry.coordinates) &&
      req.body.Campground.geometry.coordinates.length === 2 &&
      !isNaN(req.body.Campground.geometry.coordinates[0]) &&
      !isNaN(req.body.Campground.geometry.coordinates[1])
    ) {
      geometry = {
        type: 'Point',
        coordinates: [
          parseFloat(req.body.Campground.geometry.coordinates[0]),
          parseFloat(req.body.Campground.geometry.coordinates[1])
        ]
      };
    } else {
      // Fallback: use reverse geocoding from location string
      const geoData = await maptilerClient.geocoding.forward(
        req.body.Campground.location,
        { limit: 1 }
      );
      if (geoData && geoData.features && geoData.features[0] && geoData.features[0].geometry) {
        geometry = geoData.features[0].geometry;
      }
    }
    const Campground = await campground.findByIdAndUpdate(id,{...req.body.Campground},{new:true});
    if (geometry) {
      Campground.geometry = geometry;
    }
    const images = req.files.map(f=>({url: f.path, filename: f.filename}));
    Campground.images.push(...images);
    await Campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(Campground);
    }
    req.flash('success','Successfully updated the campground!');
    res.redirect(`/campgrounds/${Campground.id}`);
};
module.exports.destroy = async (req,res)=>{
    const {id} = req.params;
    const Campground = await campground.findById(id);
    if(!Campground.author.equals(req.user._id)){
        req.flash('error','You don`t have permission to do that');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
    const campground_deleted = await campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground');
    res.redirect('/campgrounds');
    }
};
