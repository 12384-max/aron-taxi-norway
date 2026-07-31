/* ==================================================
   BOOKING.JS - DEL 5
================================================== */

import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const bookButton = document.getElementById("bookTaxi");

bookButton.addEventListener("click", async () => {

    const pickup = document.getElementById("pickup").value.trim();
    const destination = document.getElementById("destination").value.trim();

    const price = document.getElementById("tripPrice").textContent;
    const distance = document.getElementById("tripDistance").textContent;
    const duration = document.getElementById("tripTime").textContent;

    if (!pickup || !destination) {

        showToast(
            "Mangler informasjon",
            "Velg hentested og destinasjon.",
            "error"
        );

        return;

    }

    if (!auth.currentUser) {

        window.location.href = "auth.html";

        return;

    }

    try {

        await addDoc(collection(db, "bookings"), {

            customerId: auth.currentUser.uid,

            email: auth.currentUser.email,

            pickup,

            destination,

            price,

            distance,

            duration,

            status: "waiting",

            driverId: null,

            driverName: null,

            createdAt: serverTimestamp()

        });

        playNotificationSound();

        showToast(

            "🚖 Bestilling sendt",

            "Vi søker etter en ledig sjåfør."

        );

        setTimeout(() => {

            window.location.href = "customer.html";

        }, 2000);

    }

    catch (error) {

        console.error(error);

        showToast(

            "Feil",

            "Bestillingen kunne ikke sendes.",

            "error"

        );

    }

});