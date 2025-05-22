const  nodemailer = require('nodemailer');
const Driver = require('../models/Driver'); 

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

// Approve Driver Controller
const approveDriver = async (req, res) => {
    try {
        const { driverId } = req.params;

        // Update the driver's `isApproved` field to true
        // await Driver.findByIdAndUpdate(driverId, { isApproved: true });
        const driver=await Driver.findById(driverId);
        driver.isApproved=true;
        await driver.save();
        // Send Approved email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: driver.email,
            subject: 'Driver Document Approved',
            text: `Hello ${driver.fullName},\n\nYour document has been approved. You can login now as a driver. follow the link: http://hr-sporer.onrender.com/auth/login`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).send("Driver approved successfully.");
    } catch (error) {
        console.error("Error approving driver:", error);
        res.status(500).send("An error occurred while approving the driver.");
    }
};

// Delete Driver Controller
const deleteDriver = async (req, res) => {
    try {
        const { driverId } = req.params;
        // console.log("driverId", driverId);

        const driver = await Driver.findById(driverId);
        // Send rejection email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: driver.email,
            subject: 'Driver Document Denied',
            text: `Hello ${driver.fullName},\n\nYour document has been rejected. You have to create a new account and make sure your document is valid. follow the link: https://hr-sporer.onrender.com/auth/driverSignup`,
        };
        await transporter.sendMail(mailOptions);

        // Delete the driver from the database
        // await Driver.findByIdAndDelete(driverId);
        await driver.deleteOne();

        res.status(200).send("Driver deleted successfully.");
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).send("An error occurred while deleting the driver.");
    }
};

module.exports = {
    approveDriver,
    deleteDriver,
};  