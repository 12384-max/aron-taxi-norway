// ==========================================
// ARON TAXI NORWAY
// AUTH.JS
// ==========================================

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    doc,
    setDoc
} from "./firebase.js";

// ================================
// HTML ELEMENTER
// ================================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ================================
// FANER
// ================================

loginTab.onclick = () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.style.display = "block";
    registerForm.style.display = "none";

};

registerTab.onclick = () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.style.display = "block";
    loginForm.style.display = "none";

};

// ================================
// REGISTRERING
// ================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("userRole").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            email: email,
            role: role,

            online: false,

            createdAt: new Date()

        });

        alert("✅ Konto opprettet!");

        if (role === "driver") {

            window.location.href = "driver.html";

        } else {

            window.location.href = "customer.html";

        }

    } catch (error) {

        alert(error.message);

    }

});

// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    try {

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        alert("✅ Innlogging vellykket!");

        window.location.href = "customer.html";

    }

    catch(error){

        alert(error.message);

    }

});

console.log("AUTH READY");