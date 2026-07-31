/* ==================================================
   ARON TAXI NORWAY V2.0
   MAP.JS - DEL 1
================================================== */
let destinationMarker = null;
let routeLayer = null;

// Lim inn DIN OpenRouteService API-nøkkel her
const ORS_API_KEY = "DIN_OPENROUTESERVICE_API_KEY";

let map;
let userMarker;

// =========================
// START MAP
// =========================

function initMap() {

    map = L.map("map", {

        zoomControl: false

    }).setView([59.9139, 10.7522], 12);

    L.control.zoom({

        position: "bottomright"

    }).addTo(map);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 20,
            attribution: "© OpenStreetMap"
        }
    ).addTo(map);

}

initMap();

// =========================
// GET CURRENT LOCATION
// =========================

function locateUser() {

    if (!navigator.geolocation) {

        alert("Geolocation støttes ikke.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            map.setView([lat, lng], 16);

            if (userMarker) {

                map.removeLayer(userMarker);

            }

            userMarker = L.marker([lat, lng]).addTo(map);

            userMarker.bindPopup(

                "📍 Du er her"

            ).openPopup();

        },

        () => {

            alert("Kunne ikke hente posisjonen.");

        }

    );

}

// =========================
// BUTTON
// =========================

const locationButton =
document.getElementById("currentLocation");

if(locationButton){

locationButton.onclick = locateUser;

}/* ==================================================
   MAP.JS - DEL 2
================================================== */

let pickupMarker = null;

// =========================
// VELG HENTESTED FRA KART
// =========================

map.on("click", function (e) {

    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    if (pickupMarker) {

        map.removeLayer(pickupMarker);

    }

    pickupMarker = L.marker([lat, lng]).addTo(map);

    pickupMarker.bindPopup("📍 Hentested").openPopup();

    document.getElementById("pickup").value =
        lat + ", " + lng;

});

// =========================
// DOBBELTKLIKK = ZOOM
// =========================

map.doubleClickZoom.enable();

// =========================
// FLYTT MARKØR
// =========================

function movePickupMarker(lat, lng) {

    if (pickupMarker) {

        map.removeLayer(pickupMarker);

    }

    pickupMarker = L.marker([lat, lng]).addTo(map);

    map.flyTo([lat, lng], 16, {

        animate: true,

        duration: 1.2

    });

}/* ==================================================
   MAP.JS - DEL 3
================================================== */

const pickupInput = document.getElementById("pickup");
const destinationInput = document.getElementById("destination");

// =========================
// SØK ETTER ADRESSE
// =========================

async function searchAddress(query){

    if(query.length < 3) return [];

    const url =
`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    return await response.json();

}

// =========================
// HENTESTED
// =========================

pickupInput.addEventListener("change", async ()=>{

    const results = await searchAddress(pickupInput.value);

    if(results.length===0) return;

    const place = results[0];

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    movePickupMarker(lat,lon);

    pickupInput.value = place.display_name;

});

// =========================
// DESTINASJON
// =========================

destinationInput.addEventListener("change", async ()=>{

    const results = await searchAddress(destinationInput.value);

    if(results.length===0) return;

    const place = results[0];

    destinationInput.value = place.display_name;

});/* ==================================================
   MAP.JS - DEL 4
================================================== */

async function calculateRoute() {

    if (!pickupMarker || !destinationMarker) return;

    const start = pickupMarker.getLatLng();
    const end = destinationMarker.getLatLng();

    try {

        const response = await fetch(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
                method: "POST",
                headers: {
                    "Authorization": ORS_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    coordinates: [
                        [start.lng, start.lat],
                        [end.lng, end.lat]
                    ]
                })
            }
        );

        const data = await response.json();

        if (routeLayer) {
            map.removeLayer(routeLayer);
        }

        routeLayer = L.geoJSON(data, {
            style: {
                color: "#FFC107",
                weight: 6
            }
        }).addTo(map);

        map.fitBounds(routeLayer.getBounds(), {
            padding: [40, 40]
        });

        const summary = data.features[0].properties.summary;

        const distanceKm = summary.distance / 1000;
        const durationMin = summary.duration / 60;

        document.getElementById("tripDistance").textContent =
            distanceKm.toFixed(1) + " km";

        document.getElementById("tripTime").textContent =
            Math.round(durationMin) + " min";

        // Prisestimat
        const basePrice = 99;
        const kmPrice = 18;

        const price =
            basePrice + (distanceKm * kmPrice);

        document.getElementById("tripPrice").textContent =
            Math.round(price) + " kr";

    } catch (err) {

        console.error(err);

    }

}