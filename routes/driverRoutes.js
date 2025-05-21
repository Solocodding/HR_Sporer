const express = require('express');
const router = express.Router();
const driverCheck = require('../middlewares/driverCheck');
const verifyToken = require('../middlewares/verifyToken');
const { updateLocation, updateRoute } = require('../controllers/driverController');

router.get("/", verifyToken, driverCheck, (req, res) => {
    res.render("./driver/driver-dashboard");
});

router.post('/update-location', verifyToken, driverCheck, updateLocation);
router.post('/update-route', verifyToken, driverCheck, updateRoute);

module.exports = router;
