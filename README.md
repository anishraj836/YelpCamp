# 🏕️ YelpCamp

YelpCamp is a full-stack campground listing web application where users can create, view, review, and manage campgrounds.

## 🌐 Live Demo
Hosted on [Render](https://yelpcamp-wvq6.onrender.com/)

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
- **Other**: connect-mongo (session store), method-override, express-session

## 📸 Screenshots
<!-- Add screenshots if available -->

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)
- [MapTiler](https://www.maptiler.com/) account (for maps)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/yelpcamp.git
   cd yelpcamp
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   DB_URL=mongodb://127.0.0.1:27017/yelp-camp
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   MAPTILER_API_KEY=your_maptiler_key
   ```
4. **(Optional) Seed the database:**
   ```bash
   node seeds/index.js
   ```
5. **Start the server:**
   ```bash
   node app.js
   ```
   The app will run on [http://localhost:3000](http://localhost:3000) by default.

## 🧑‍💻 Usage
- Register a new account or log in.
- Browse, create, edit, and delete campgrounds.
- Add reviews to campgrounds.
- Upload images for campgrounds.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[ISC](LICENSE)

## 🙏 Acknowledgements
- Colt Steele's Web Developer Bootcamp
- MapTiler, Cloudinary, Bootstrap, MongoDB, and the open-source community
