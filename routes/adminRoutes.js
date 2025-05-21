const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const adminCheck = require('../middlewares/adminCheck');
const verifyToken = require('../middlewares/verifyToken');
const { approveDriver, deleteDriver } = require('../controllers/adminController');

// Admin Dashboard Route
router.get('/', verifyToken, adminCheck, (req, res) => {
    res.render('admin/admin-dashboard.ejs'); // Render the admin dashboard view);
});

// Route to get the new drivers list
router.get('/new-drivers', verifyToken, adminCheck, async (req, res) => {
    try {
        // Find drivers whose `isApproved` field is false
        const newDrivers = await Driver.find({ isApproved: false }).select('fullName email license');
        const updatedDrivers = newDrivers.map(driver => ({
            ...driver._doc,
            license: `/${driver.license}` // Assuming `license` contains the filename only
        }));
        res.render('admin/newDriver.ejs', { drivers: updatedDrivers });
    } catch (error) {
        console.error("Error fetching new drivers:", error);
        res.status(500).send("An error occurred while fetching new drivers.");
    }
});

// Approve a driver
router.post('/approve-driver/:driverId', verifyToken, adminCheck, approveDriver);

// Delete a driver
router.delete('/delete-driver/:driverId', verifyToken, adminCheck, deleteDriver);

module.exports = router;
