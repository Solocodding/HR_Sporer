const express = require('express');
const upload = require('../middlewares/multer');
const verifyToken = require('../middlewares/verifyToken');
const { signupUser, signupDriver, verifySignup, login, resetPassword, verifyResetPassword, updatePassword } = require("../controllers/authController");

// req.user = user;
// req.isAuthenticated = true;

const router = express.Router();

// Route to render signup page
router.get("/userSignup", (req, res) => {
     if(req.isAuthenticated && req.user.role==="user") {
        return res.redirect('/user-dashboard');
    }else if(req.isAuthenticated && req.user.role==="driver") {
        return res.redirect("/driver-dashboard");
    }else if(req.isAuthenticated && req.user.role==="admin") {
        return res.redirect("/admin-dashboard");
    }else{
        res.render("./auth/userSignup");
    }
});

// Route to render driver signup page
router.get("/driverSignup",verifyToken, (req, res) => {
     if(req.isAuthenticated && req.user.role==="user") {
        return res.redirect('/user-dashboard');
    }else if(req.isAuthenticated && req.user.role==="driver") {
        return res.redirect("/driver-dashboard");
    }else if(req.isAuthenticated && req.user.role==="admin") {
        return res.redirect("/admin-dashboard");
    }else{
        res.render("./auth/driverSignup");
    }
});

// Route to render login page
router.get("/login",verifyToken, (req, res) => {
    if(req.isAuthenticated && req.user.role==="user") {
        return res.redirect('/user-dashboard');
    }else if(req.isAuthenticated && req.user.role==="driver") {
        return res.redirect("/driver-dashboard");
    }else if(req.isAuthenticated && req.user.role==="admin") {
        return res.redirect("/admin-dashboard");
    }else{
        res.render("./auth/login");
    }
});

// Route to render verify signup page
router.get('/verify/signup', (req, res) => {
    res.render("./auth/verifySignup");
});

router.get("/reset-password",(req, res) => {
    res.render("./auth/resetPassword");
})
router.get("/updatePassword",(req, res) => {
    res.render("./auth/updatePassword"); 
});
router.get('/logout', (req, res) => {
    res.clearCookie('authToken'); // Clear the authentication cookie
    res.clearCookie('userToken');
    res.clearCookie('driverToken');
    res.redirect('/auth/login'); // Redirect to the login page or homepage
});

router.get(`/reset-password/:randomReq/:id`,verifyResetPassword);
// User signup route
router.post("/userSignup", signupUser);

// Driver signup route with file upload middleware
router.post('/driverSignup', upload.single('license'), signupDriver);

// Verify signup route (corrected path)
router.post("/verify/signup", verifySignup);

// Login route
router.post("/login", login);

router.post("/reset-password",resetPassword);
router.post("/updatePassword",updatePassword);

module.exports = router;
