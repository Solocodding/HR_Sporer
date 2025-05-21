require('dotenv').config();
const path=require('path');
const express=require('express');
const app=express();

const cookieParser=require("cookie-parser");

const authRoutes=require("./routes/authRoutes");
const adminRoutes=require("./routes/adminRoutes");
const userRoutes=require("./routes/userRoutes");
const driverRoutes=require("./routes/driverRoutes");

const connectDB=require('./config/db');
connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes
app.use('/auth', authRoutes);
app.use('/admin-dashboard',adminRoutes);
app.use('/user-dashboard',userRoutes);
app.use('/driver-dashboard',driverRoutes);

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");
})
