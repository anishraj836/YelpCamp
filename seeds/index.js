require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const {places,descriptors} = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("DATABASE CONNECTED!")
});



const sample = array =>{
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async()=>{
    await campground.deleteMany({});
    for (let i = 0; i < 1000; i++) {
        try {
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    
            const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
    
            if (!geoData.features || geoData.features.length === 0) {
                console.log(`Skipping ${location} - No geo data`);
                continue;
            }
    
            const camp = new campground({
                author: '6855d0ffc555b83dad65b0f4',
                geometry: geoData.features[0].geometry,
                location,
                images: [
                    { url: 'https://res.cloudinary.com/dbas17tn2/image/upload/v1750253376/YelpCamp/ykecsw6wkm58tzdjo8we.jpg', filename: 'YelpCamp/ykecsw6wkm58tzdjo8we' },
                    { url: 'https://res.cloudinary.com/dbas17tn2/image/upload/v1750253379/YelpCamp/lc9fi3ieomqg3rolgghw.jpg', filename: 'YelpCamp/lc9fi3ieomqg3rolgghw' },
                    { url: 'https://res.cloudinary.com/dbas17tn2/image/upload/v1750253379/YelpCamp/d1fojfzmtmmw0rpqyyo0.jpg', filename: 'YelpCamp/d1fojfzmtmmw0rpqyyo0' }
                ],
                description: 'Lorem ipsum...',
                title: `${sample(descriptors)} ${sample(places)}`,
                price
            });
    
            await camp.save();
            console.log(`Saved: ${camp.title}`);
        } catch (err) {
            console.log(`Error at index ${i}:`, err.message);
            continue; // Skip failed entries
        }
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});