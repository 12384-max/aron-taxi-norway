/* ==================================================
   DRIVER.JS - DEL 1
================================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    updateDoc,
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let currentUser = null;
let online = false;

// ==============================
// LOGIN
// ==============================

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="auth.html";

        return;

    }

    currentUser=user;

    listenForTrips();

});

// ==============================
// ONLINE / OFFLINE
// ==============================

const onlineBtn=document.getElementById("onlineBtn");

onlineBtn.addEventListener("click",async()=>{

    online=!online;

    document.getElementById("driverOnlineStatus").innerHTML=

    online ?

    "🟢 Online"

    :

    "🔴 Offline";

    onlineBtn.innerHTML=

    online ?

    "🔴 Gå Offline"

    :

    "🟢 Gå Online";

    await updateDoc(

        doc(db,"drivers",currentUser.uid),

        {

            online:online,

            lastSeen:new Date()

        }

    );

});

// ==============================
// NYE BESTILLINGER
// ==============================

function listenForTrips(){

    const q=query(

        collection(db,"bookings"),

        where("status","==","waiting")

    );

    onSnapshot(q,(snapshot)=>{

        if(snapshot.empty){

            return;

        }

        const booking=snapshot.docs[0];

        const data=booking.data();

        window.currentBookingId=booking.id;

        document.getElementById("pickupLocation").textContent=
        data.pickup;

        document.getElementById("destinationLocation").textContent=
        data.destination;

        document.getElementById("tripPriceDriver").textContent=
        data.price;

    });

}/* ==================================================
   DRIVER.JS - DEL 2
================================================== */

import {
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==============================
// GODTA TUR
// ==============================

const acceptButton = document.getElementById("acceptTrip");

acceptButton.addEventListener("click", async () => {

    if (!window.currentBookingId) {

        showToast(
            "Ingen tur",
            "Det finnes ingen aktiv forespørsel.",
            "error"
        );

        return;

    }

    try {

        const driverDoc = await getDoc(
            doc(db, "drivers", currentUser.uid)
        );

        const driver = driverDoc.data();

        await updateDoc(

            doc(db, "bookings", window.currentBookingId),

            {

                status: "accepted",

                driverId: currentUser.uid,

                driverName: driver?.name || currentUser.email,

                driverPhone: driver?.phone || "",

                driverCar: driver?.car || "Taxi",

                acceptedAt: new Date()

            }

        );

        showToast(

            "🚖 Tur godtatt",

            "Kunden har blitt varslet."

        );

    } catch (error) {

        console.error(error);

        showToast(

            "Feil",

            "Kunne ikke godta tur.",

            "error"

        );

    }

});

// ==============================
// AVSLÅ TUR
// ==============================

const rejectButton = document.getElementById("rejectTrip");

rejectButton.addEventListener("click", () => {

    showToast(

        "Tur avslått",

        "Du vil motta neste forespørsel."

    );

    document.getElementById("pickupLocation").textContent = "-";
    document.getElementById("destinationLocation").textContent = "-";
    document.getElementById("tripPriceDriver").textContent = "0 kr";

    window.currentBookingId = null;

});/* ==================================================
   DRIVER.JS - DEL 3
================================================== */

import {
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let driverMap;
let driverMarker;

// =========================
// START MAP
// =========================

function initDriverMap(){

    driverMap = L.map("driverMap",{

        zoomControl:false

    }).setView([59.9139,10.7522],12);

    L.control.zoom({

        position:"bottomright"

    }).addTo(driverMap);

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:"© OpenStreetMap",

            maxZoom:20

        }

    ).addTo(driverMap);

}

initDriverMap();

// =========================
// LIVE GPS
// =========================

function startTracking(){

    if(!navigator.geolocation){

        console.log("GPS støttes ikke.");

        return;

    }

    navigator.geolocation.watchPosition(

        async(position)=>{

            const lat=position.coords.latitude;
            const lng=position.coords.longitude;

            if(driverMarker){

                driverMarker.setLatLng([lat,lng]);

            }else{

                driverMarker=L.marker([lat,lng]).addTo(driverMap);

                driverMarker.bindPopup("🚖 Din posisjon");

            }

            driverMap.setView([lat,lng],16);

            if(currentUser){

                await updateDoc(

                    doc(db,"drivers",currentUser.uid),

                    {

                        latitude:lat,

                        longitude:lng,

                        lastLocation:serverTimestamp()

                    }

                );

            }

        },

        (error)=>{

            console.error(error);

        },

        {

            enableHighAccuracy:true,

            maximumAge:5000,

            timeout:10000

        }

    );

}

startTracking();