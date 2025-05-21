const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false, // False until email verification is complete
  },
  isAdmin: {
    type: Boolean,
    default: false, // False until email verification is complete
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
