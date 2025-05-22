const { json } = require('express');
const Driver = require('../models/Driver');

const searchRoutes = async (req, res) => {
    let { start, destination } = req.body;
    start = start.toLowerCase().trim();
    destination = destination.toLowerCase().trim();

    if (!start || !destination) {
        return res.status(400).json({ message: 'Both "start" and "destination" fields are required.' });
    }

    try {
        // Fetch drivers whose routes include both 'start' and 'destination'
        const allMatchingDrivers = await Driver.find({
            isApproved: true,
            $or: [
                { from: start },
                { to: destination },
                { via: { $in: [start, destination] } } // Check if 'start' or 'destination' is in 'via'
            ],
        }).select('location fullName from via to _id'); // Select only relevant fields

        // Filter drivers whose routes maintain the correct sequence of stops
        const validDrivers = allMatchingDrivers.filter((driver) => {
            const route = [driver.from, ...driver.via, driver.to]; // Combine 'from', 'via', and 'to' into a single route array
            const startIndex = route.indexOf(start);
            const destinationIndex = route.indexOf(destination);

            // Ensure 'start' appears before 'destination' and both are in the route
            return startIndex !== -1 && destinationIndex !== -1 && startIndex < destinationIndex;
        });

        if (validDrivers.length === 0) {
            return res.render('user/searchCard', { message: 'No any Buses are running on this route right now.' });
        }

        return res.status(200).render('map', {
            matchingDrivers: JSON.stringify(validDrivers), // Pass as a string
            start,
            destination
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while searching for routes.' });
    }
};

const fetchDriverUpdates = async (req, res) => {
    let { start, destination } = req.body;
    start = start.toLowerCase().trim();
    destination = destination.toLowerCase().trim();

    try {
        // Fetch drivers whose routes include both 'start' and 'destination'
        const allMatchingDrivers = await Driver.find({
            isApproved: true,
            $or: [
                { from: start },
                { to: destination },
                { via: { $in: [start, destination] } }
            ],
        }).select('location fullName from via to _id'); // Select only relevant fields

        // Filter drivers whose routes maintain the correct sequence of stops
        const validDrivers = allMatchingDrivers.filter((driver) => {
            const route = [driver.from, ...driver.via, driver.to]; // Combine 'from', 'via', and 'to' into a single route array
            const startIndex = route.indexOf(start);
            const destinationIndex = route.indexOf(destination);

            // Ensure 'start' appears before 'destination' and both are in the route
            return startIndex !== -1 && destinationIndex !== -1 && startIndex < destinationIndex;
        });

        if (validDrivers.length === 0) {
            return res.status(404).json({ message: 'No buses are running on this route now.' });
        }

        return res.status(200).json(validDrivers);
    } catch (error) {
        console.error('Error fetching driver updates:', error);
        return res.status(500).json({ message: 'Server error while fetching driver updates.' });
    }
};

module.exports = { searchRoutes, fetchDriverUpdates };
