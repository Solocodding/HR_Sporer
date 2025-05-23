<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Map</title>
    <!-- <script>
        // Load Google Maps API
        (function loadGoogleMapsAPI() {
            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCwe3Pp9vtt1lPjMSZz-nicQ58DEK_SUuM&callback=initMap";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        })();
    </script> -->
    <script>
        (g => {
            let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
            b = b[c] || (b[c] = {});
            let d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
            d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
        })({
            key: "AIzaSyCwe3Pp9vtt1lPjMSZz-nicQ58DEK_SUuM",
            version: "weekly",
        });
    </script>
    <style>
        body,
        html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        .map-container {
            width: 100%;
            height: 100vh;
        }

        #map {
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>
    <div class="map-container">
        <div id="map"></div>
    </div>

    <script>
        let map;
        let markers = {};

        // Fetch the drivers from the server-rendered data
        const Drivers = JSON.parse('<%- matchingDrivers %>');

        const defaultCenter = {
            lat: Drivers[0].location.lat,
            lng: Drivers[0].location.lng,
        };
        // Initialize Google Map
        async function initMap () {
            // console.log("Google Maps API loaded, initializing map...");///////////////////////////
            const { Map } = await google.maps.importLibrary("maps");
            map = new Map(document.getElementById('map'), {
                center: defaultCenter,
                zoom: 16,
                // mapId: "DEMO_MAP_ID", // Map ID is required for advanced markers.
            });

            // Add markers for all drivers
            Drivers.forEach(driver => addOrUpdateMarker(driver));
        };

        // Add or update a marker
        const addOrUpdateMarker = async (driver) => {
            const position = {
                lat: driver.location.lat,
                lng: driver.location.lng,
            };

            if (markers[driver._id]) {
                markers[driver._id].setPosition(position);
            } else {
                const { Marker } = await google.maps.importLibrary("marker");
                const marker = new Marker({
                    position,
                    map,
                    title: `Driver: ${driver.fullName}`,
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div>
                                <h3>Driver:${driver.fullName}</h3>
                                <p><strong>Route:</strong> ${driver.from} → ${driver.via.join(', ')} → ${driver.to}</p>
                              </div>`,
                });

                marker.addListener('click', () => infoWindow.open(map, marker));
                markers[driver._id] = marker;
            }
        };

        // Fetch driver updates
        const fetchDriverUpdates = async () => {
            try {
                const response = await fetch('/user-dashboard/fetchDriverUpdates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start: '<%= start %>',
                        destination: '<%= destination %>',
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedDrivers = await response.json();
                updatedDrivers.forEach(driver => addOrUpdateMarker(driver));
            } catch (error) {
                console.error('Error fetching driver updates:', error);
            }
        };

        // Start polling driver updates
        let intervalId;

        const startPolling = () => {
            intervalId = setInterval(fetchDriverUpdates, 5000); // Poll every 5 seconds
        };

        const stopPolling = () => {
            if (intervalId) clearInterval(intervalId);
        };

        // Start polling when the map is loaded
        window.addEventListener("load", async () => {
            await initMap();
            startPolling();
        });
        
        window.addEventListener('beforeunload', stopPolling);
    </script>
</body>

</html>





<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Map</title>
    <!-- <script>
        // Load Google Maps API
        (function loadGoogleMapsAPI() {
            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCwe3Pp9vtt1lPjMSZz-nicQ58DEK_SUuM&callback=initMap";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        })();
    </script> -->
    <script>
        (g => {
            let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
            b = b[c] || (b[c] = {});
            let d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries","geometry", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
            d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
        })({
            key: "AIzaSyCwe3Pp9vtt1lPjMSZz-nicQ58DEK_SUuM",
            version: "weekly",
        });
    </script>
    <style>
        body,
        html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        .map-container {
            width: 100%;
            height: 100vh;
        }

        #map {
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>
    <div class="map-container">
        <div id="map"></div>
    </div>

    <script>
        let map;
        let markers = {};
        let routePolyline = null;

        const routeMap = {
            "delhi": { lat: 28.9445566, lng: 77.2193107 },
            "haridwar": { lat: 29.9460562, lng: 78.1512638 },
            "yamunanagar": { lat: 30.1494003, lng: 77.2666319 },
            "karnal": { lat: 29.6909036, lng: 76.9826593 },
            "ladwa": { lat: 29.995411, lng: 77.048816 },
            "indri": { lat: 29.8825392, lng: 77.0474098 }
            // Add more as needed
        };

        // Fetch the drivers from the server-rendered data
        const Drivers = JSON.parse('<%- matchingDrivers %>');
        const destination = '<%- destination %>';
        // console.log(destination);

        const defaultCenter = {
            lat: Drivers[0].location.lat,
            lng: Drivers[0].location.lng,
        };
        // Initialize Google Map
        async function initMap () {
            const { Map } = await google.maps.importLibrary("maps");
            map = new Map(document.getElementById('map'), {
                center: defaultCenter,
                zoom: 16,
                // mapId: "DEMO_MAP_ID", // Map ID is required for advanced markers.
            });

            // Add markers for all drivers
            Drivers.forEach(driver => addOrUpdateMarker(driver));
        };

        // Add or update a marker
        const addOrUpdateMarker = async (driver) => {
            const position = {
                lat: driver.location.lat,
                lng: driver.location.lng,
            };

            if (markers[driver._id]) {
                markers[driver._id].setPosition(position);
            } else {
                const { Marker } = await google.maps.importLibrary("marker");
                const marker = new Marker({
                    position,
                    map,
                    title: `Driver: ${driver.fullName}`,
                });

                const infoContent = `<div>
                                    <h3>Driver: ${driver.fullName}</h3>
                                    <p><strong>Route:</strong> ${driver.from} → ${driver.via.join(', ')} → ${driver.to}</p>
                                </div>`;

                const infoWindow = new google.maps.InfoWindow({ content: infoContent });

                marker.addListener('click', async() => {
                    infoWindow.open(map, marker);
                    await drawRoute(driver);
                });

                markers[driver._id] = marker;
            }
        };

        async function drawRoute(driver) {
            if (routePolyline) {
                routePolyline.setMap(null); // Clear previous route
            }

            const routePoints = [];

            // Push current location
            routePoints.push({ lat: driver.location.lat, lng: driver.location.lng });

            // Add via stops if available in map
            for (const stop of driver.via) {
                // if( stop === destination) {
                //     routePoints.push(routeMap[stop]);
                //     break; // Stop drawing if destination is reached
                // }else
                if(routeMap[stop]) 
                {
                    routePoints.push(routeMap[stop]);
                }
            }

            // Add destination if available
            if (routeMap[driver.to]) {
                routePoints.push(routeMap[driver.to]);
            } else {
                console.warn(`No coordinates found for destination: ${driver.to}`);
                return; // Skip drawing if destination not found
            }

            routePolyline = new google.maps.Polyline({
                path: routePoints,
                geodesic: true,
                strokeColor: '#4285F4',
                strokeOpacity: 1.0,
                strokeWeight: 4,
            });

            routePolyline.setMap(map);
        }

        // Fetch driver updates
        const fetchDriverUpdates = async () => {
            try {
                const response = await fetch('/user-dashboard/fetchDriverUpdates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start: '<%= start %>',
                        destination: '<%= destination %>',
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedDrivers = await response.json();
                updatedDrivers.forEach(driver => addOrUpdateMarker(driver));
            } catch (error) {
                console.error('Error fetching driver updates:', error);
            }
        };

        // Start polling driver updates
        let intervalId;

        const startPolling = () => {
            intervalId = setInterval(fetchDriverUpdates, 5000); // Poll every 5 seconds
        };

        const stopPolling = () => {
            if (intervalId) clearInterval(intervalId);
        };

        // Start polling when the map is loaded
        window.addEventListener("load", async () => {
            await initMap();
            startPolling();
        });
        
        window.addEventListener('beforeunload', stopPolling);
    </script>
</body>

</html>
