const Driver = require('../models/Driver');

// Update Location
const updateLocation = async (req, res) => {
    // console.log("location updated");////////////////////////
    const { lat, lng } = req.body;
    try {
        await Driver.findByIdAndUpdate(req.user._id, { location: { lat, lng } });
        res.status(200).send('Location updated');
    } catch (error) {
        res.status(500).send('Error updating location');
    }
};

// Update Route
const updateRoute = async (req, res) => {
    let { from, via, to } = req.body;
    from=from.toLowerCase();
    to=to.toLowerCase();
    via=via.map((stop) => stop.toLowerCase());
    try {
        await Driver.findByIdAndUpdate(req.user.id, { from, via, to });
        res.status(200).send('Route updated');
    } catch (error) {
        res.status(500).send('Error updating route');
    }
};

module.exports = { updateLocation, updateRoute };