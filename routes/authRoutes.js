const express = require('express');
const upload = require('../middlewares/multer');
const { signupUser, signupDriver, verifySignup, login } = require("../controllers/authController");

const router = express.Router();

// Route to render signup page
router.get("/userSignup", (req, res) => {
    res.render("./auth/userSignup");
});

// Route to render driver signup page
router.get("/driverSignup", (req, res) => {
    res.render("./auth/driverSignup");
});

// Route to render login page
router.get("/login", (req, res) => {
    res.render("./auth/login");
});

// Route to render verify signup page
router.get('/verify/signup', (req, res) => {
    res.render("./auth/verifySignup");
});

// User signup route
router.post("/userSignup", signupUser);

// Driver signup route with file upload middleware
router.post('/driverSignup', upload.single('license'), signupDriver);

// Verify signup route (corrected path)
router.post("/verify/signup", verifySignup);

// Login route
router.post("/login", login);

module.exports = router;
