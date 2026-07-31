/* ==================================================
   CUSTOMER.JS - DEL 1
================================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ======================================
// LOGIN
// ======================================

onAuthStateChanged(auth,(user)=>{

    if(!user){

        window.location.href="auth.html";

        return;

    }

    document.getElementById("customerName").textContent=
    user.email;

    loadLatestBooking(user.uid);

});

// ======================================
// HENT SISTE BESTILLING
// ======================================

function loadLatestBooking(uid){

const q=query(

collection(db,"bookings"),

where("customerId","==",uid),

orderBy("createdAt","desc"),

limit(1)

);

onSnapshot(q,(snapshot)=>{

if(snapshot.empty){

document.getElementById("tripStatus").textContent=
"Ingen aktiv bestilling";

return;

}

const booking=snapshot.docs[0].data();

document.getElementById("pickupText").textContent=
booking.pickup;

document.getElementById("destinationText").textContent=
booking.destination;

document.getElementById("priceText").textContent=
booking.price;

updateDriverInfo(booking);

});

}

// ======================================
// STATUS
// ======================================

function updateStatus(status){

const statusElement=
document.getElementById("tripStatus");

switch(status){

case "waiting":

statusElement.innerHTML=
"🟡 Søker etter sjåfør";

break;

case "accepted":

statusElement.innerHTML=
"🔵 Sjåfør funnet";

break;

case "arriving":

statusElement.innerHTML=
"🚖 Sjåføren er på vei";

break;

case "picked_up":

statusElement.innerHTML=
"🟢 Tur pågår";

break;

case "completed":

statusElement.innerHTML=
"✅ Tur fullført";

break;

default:

statusElement.innerHTML=
"⚪ Ingen aktiv tur";

}

}/* ==========================================
   DRIVER INFO
========================================== */

function updateDriverInfo(booking){

    document.getElementById("driverName").textContent =
        booking.driverName || "Søker etter sjåfør...";

    document.getElementById("driverCar").textContent =
        booking.driverCar || "Ingen bil tildelt";

    document.getElementById("driverEta").textContent =
        booking.eta || "--";

    document.getElementById("driverStatus").textContent =
        booking.status || "Venter";

}