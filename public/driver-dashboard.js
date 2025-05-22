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

// Modal Logic
const modal = document.getElementById("update-route-modal");
const updateRouteBtn = document.getElementById("update-route-btn");
const closeBtn = document.querySelector(".close-btn");

updateRouteBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Update Route Form Submission
const updateRouteForm = document.getElementById("update-route-form");

updateRouteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const from = document.getElementById("from").value.toLowerCase();
    const via = document.getElementById("via").value.split(",").map((stop) => stop.trim().toLowerCase());
    const to = document.getElementById("to").value.toLowerCase();

    try {
        const response = await fetch("/driver-dashboard/update-route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, via, to }),
        });

        if (response.ok) {
            alert("Route updated successfully!");
            modal.style.display = "none";
        } else {
            const errorText = await response.text();
            alert("Error updating route: " + errorText);
        }
    } catch (error) {
        console.error("Error updating route:", error);
        alert("An unexpected error occurred while updating the route.");
    }
});

document.getElementById("dropdownMenu").addEventListener("click", () => {
    const dropdown = document.querySelector(".dropdown-content");
    dropdown.classList.toggle("show");
});
