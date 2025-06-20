# 🏕️ YelpCamp

YelpCamp is a full-stack campground listing web application where users can create, view, review, and manage campgrounds.

## 🌐 Live Demo
Hosted on [Render](https://your-render-link-here.com)

## 📷 Features
- User authentication and registration (Passport.js)
- Campground CRUD (Create, Read, Update, Delete)
- Review system for campgrounds
- Image uploads (Cloudinary)
- Map display and geocoding (MapTiler)
- Form validation and sanitization
- Flash messages for feedback
- Security headers (Helmet), MongoDB Injection protection

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap
- **Authentication**: Passport.js
- **Image Hosting**: Cloudinary
- **Map Service**: MapTiler
- **Hosting**: Render
- **Other**: connect-mongo (session store), method-override, express-session

## 📸 Screenshots
![Home Page](screenshots/home.png)
![Campground Page](screenshots/campground.png)

## 🚀 Getting Started

Clone and run locally:

```bash
git clone https://github.com/your-username/yelpcamp.git
cd yelpcamp
npm install
npm run seed        # Optional: Seed the database
node app.js
