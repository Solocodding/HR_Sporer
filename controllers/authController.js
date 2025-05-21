const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { generateToken } = require('../utils/jwtUtils');

// Separate OTP stores for users and drivers
const userOtpStore = new Map();
const driverOtpStore = new Map();
const userStore = new Map();
const driverStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Helper function to generate OTP
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

// User Signup
const signupUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/login', { message: 'User already exists. Please log in instead.' });
        }

        const otp = generateOTP();
        const timeOut = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
        userOtpStore.set(email, { otp, timeOut });
        userStore.set(email, { fullName, password });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Signup',
            text: `Hello ${fullName},\n\nYour OTP is ${otp}. It will expire in 5 minutes.`,
        };
        await transporter.sendMail(mailOptions);

        return res.redirect('/auth/verify/signup');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

// Driver Signup
const signupDriver = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        const license = req.file; // Access the uploaded license file

        if (!license) {
            return res.status(400).render('auth/driverSignup', {
                message: 'License file is required.',
            });
        }

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).render('auth/driverSignup', {
                message: 'All fields are required.',
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('auth/driverSignup', {
                message: 'Passwords do not match.',
            });
        }

        // Check if the email is already registered
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.render('auth/login', {
                message: 'Driver already exists. Please log in instead.',
            });
        }

        // Construct the licensePath from the uploaded file
        const licensePath = `uploads/licenses/${license.filename}`; // Use the filename set by Multer

        // Temporarily store driver data until OTP verification
        driverStore.set(email, { fullName, email, password, licensePath });

        // Generate OTP and store it
        const otp = generateOTP();
        const timeOut = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
        driverOtpStore.set(email, { otp, timeOut });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Driver Signup',
            text: `Hello ${fullName},\n\nYour OTP is ${otp}. It will expire in 5 minutes.`,
        };
        await transporter.sendMail(mailOptions);

        // Redirect to OTP verification page
        return res.redirect('/auth/verify/signup');
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/driverSignup', {
            message: 'Server error during signup.',
        });
    }
};

// Verify Signup
const verifySignup = async (req, res) => {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
        return res.render(signupRedirect, { message: 'Email, OTP, and role are required.' });
    }

    const otpStore = role === 'user' ? userOtpStore : driverOtpStore;
    const userDetails = role === 'user' ? userStore.get(email) : driverStore.get(email);

    const signupRedirect = role === 'driver' ? 'auth/driverSignup' : 'auth/userSignup';

    if (!userDetails) {
        return res.render(signupRedirect, { message: 'Email does not match the one used for OTP generation.' });
    }

    const otpObj = otpStore.get(email);
    if (!otpObj || otpObj.timeOut < Date.now()) {
        otpStore.delete(email);
        userStore.delete(email);
        driverStore.delete(email);
        return res.render(signupRedirect, { message: 'OTP Expired.' });
    }

    if (otpObj.otp !== otp) {
        otpStore.delete(email);
        userStore.delete(email);
        driverStore.delete(email);
        return res.render(signupRedirect, { message: 'Invalid OTP.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);

        if (role === 'user') {
            const newUser = new User({
                fullName: userDetails.fullName,
                email,
                password: hashedPassword,
                isVerified: true,
            });
            await newUser.save();
            userStore.delete(email);
        } else if (role === 'driver') {
            const newDriver = new Driver({
                fullName: userDetails.fullName,
                email,
                password: hashedPassword,
                license: userDetails.licensePath,
                isVerified: true,
            });
            await newDriver.save();
            driverStore.delete(email);
        } else {
            return res.render(signupRedirect, { message: 'Invalid role.' });
        }

        otpStore.delete(email);

        return res.render('auth/login', { message: 'Account created Successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving user/driver in the database.' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).render('auth/login', {
            message: 'Email, Password, and Role are required.',
        });
    }

    try {
        // Find user based on role
        const foundUser = role === 'user'
            ? await User.findOne({ email })
            : await Driver.findOne({ email });

        if (!foundUser) {
            return res.status(401).render('auth/login', {
                message: 'Invalid email or password.',
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).render('auth/login', {
                message: 'Invalid password.',
            });
        }

        // Generate token
        const token = generateToken(foundUser._id, role);

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            maxAge: 1 * 60 * 60 * 1000, // 1 hr
        });

        // Redirect based on role
        return res.redirect(role === 'user' ? '/user-dashboard' : '/driver-dashboard');

    } catch (error) {
        console.error(error);
        return res.status(500).render('auth/login', {
            message: 'Internal server error. Please try again later.',
        });
    }
};

module.exports = {
    signupUser,
    signupDriver,
    verifySignup,
    login,
};

