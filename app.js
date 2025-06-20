if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
// const catchAsync = require('./utils/catchAsync');
// const { error } = require('console');
// const joi = require('joi');
const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

// const {campgroundSchema,reviewSchema} = require('./schemas.js');
// const campground = require('./models/campground');
// const Review = require('./models/review');
// const review = require('./models/review');
// const { request } = require('http');
const flash = require('connect-flash');
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

const app = express();

app.engine('ejs', ejsMate);
app.set('query parser', 'extended');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(sanitizeV5({ replaceWith: '_' }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: 'thisshouldbeasecret'
    }
});
store.on("error", function(e){
    console.log("Session Store Error", e);
})
const sessionConfig = {
    store,
    name: 'blubbb',
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.maptiler.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blubbb:",
                "data:",
                "https://res.cloudinary.com/dbas17tn2/", // ✅ YOUR actual Cloudinary cloud name
                "https://images.unsplash.com/",
              ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// app.get('/fakeUser', async (req,res)=>{
//     const user = new User({
//         email: 'anish@gmail.com',
//         username: 'Anish'
//     })
//     const newUsr = await User.register(user, 'chicken');
//     res.send(newUsr);
// })
app.use('/', userRoutes);
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.get('/', (req,res)=>{
    res.render('home');
})

app.all(/(.*)/, (req,res, next)=>{
    next(new ExpressError('Page not found', 404));
})
app.use((err,req,res,next)=>{
    const {status = 500,message="something went wrong"} = err;
    if(!err.message) err.message = "OH NO! something unexpected happened!";
    res.status(status).render('errors', {err});
})
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`LISTENING ON PORT ${port}`);
});