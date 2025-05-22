const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    license: {
        type: String, // Path to the uploaded PDF file
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false, // False until admin approval
    },
    isVerified: {
        type: Boolean,
        default: false, // False until email verification
    },
    location: {
        lat: { type: Number, default: 0.0000 }, // Latitude
        lng: { type: Number, default: 0.0000 }, // Longitude
    },
    from: {
        type: String,
        trim: true,
        toLowerCase: true,
        default: "",
    },  // Starting bus stop
    via: {
        type: [String],
        trim: true,
        toLowerCase: true,
        default: [],
    },    // List of intermediate stops
    to: {
        type: String,
        trim: true, 
        toLowerCase: true,
        default: "",
    },    // Final bus stop
    createdAt: {
        type: Date, default: Date.now
    },
    role:{
        type:String,
        required:true
    }
});

const Driver = mongoose.model("Driver", driverSchema);
module.exports = Driver;
