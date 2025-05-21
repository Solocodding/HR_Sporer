
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.SECRET_KEY,{ expiresIn: '1h' });
};

module.exports = { generateToken };
