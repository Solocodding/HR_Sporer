const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(400).render('auth/login');
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Check the role from the decoded token and fetch the appropriate user
        const { id,role } = decoded;
        // console.log(role,id);

        let user;

        if (role === 'user') {
            user = await User.findById(id).select('-password'); // Exclude the password field
        } else if (role === 'driver') {
            user = await Driver.findById(id).select('-password');
        }

        if (!user) {
            return res.status(400).render('auth/login', {
                message: 'User not found',
            });
        }

        // Attach the user information (excluding password) to the request object
        req.user = user;
        req.isAuthenticated = true;

        // Proceed with the next middleware
        next();
    } catch (error) {
        return res.status(400).render('auth/login', {
            message: 'Invalid Token',
        });
    }
};

module.exports = verifyToken;
