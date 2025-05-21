// Location Toggle
const locationToggle = document.getElementById("location-toggle");
let locationEnabled = false;
let locationWatcher = null;

// Function to send location to the server
async function sendLocationToServer(latitude, longitude, accuracy) {
    console.log("Latitude:", latitude, "Longitude:", longitude, "Accuracy:", accuracy);

    try {
        const response = await fetch("/driver-dashboard/update-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
        });

        if (!response.ok) {
            console.error("Failed to update location:", await response.text());
        }
    } catch (error) {
        console.error("Error updating location:", error);
    }
}

// Start tracking location
function startLocationUpdates() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    // Use watchPosition for continuous updates
    locationWatcher = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            // Skip updates if accuracy is poor
            if (accuracy > 50) {
                console.warn("Skipping update due to poor accuracy:", accuracy);
                return;
            }

            // Send the location data to the server
            sendLocationToServer(latitude, longitude, accuracy);
        },
        (error) => {
            console.error("Error fetching location:", error);
        },
        { enableHighAccuracy: true }
    );

    console.log("Location updates started.");
}

// Stop tracking location
function stopLocationUpdates() {
    if (locationWatcher !== null) {
        navigator.geolocation.clearWatch(locationWatcher);
        locationWatcher = null;
        console.log("Location updates stopped.");
    }
}

// Toggle location updates
locationToggle.addEventListener("click", () => {
    locationEnabled = !locationEnabled;
    locationToggle.textContent = locationEnabled ? "🟢 Location ON" : "🔴 Location OFF";

    if (locationEnabled) {
        startLocationUpdates();
    } else {
        stopLocationUpdates();
    }
});
