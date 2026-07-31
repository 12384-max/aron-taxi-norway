// ==========================================
// ARON TAXI NORWAY
// FIREBASE CONFIG
// ==========================================

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
doc,
setDoc,
updateDoc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// LEGG INN DINE FIREBASE-OPPLYSNINGER
// ==========================================

const firebaseConfig = {

apiKey: "AIzaSyCQSs5_7R-iZAVgFeHGPo1j0_-Zaw132uI",

authDomain: "aron-taxi-norway.firebaseapp.com",

projectId: "aron-taxi-norway",

storageBucket: "aron-taxi-norway.firebasestorage.app",

messagingSenderId: "430736712384",

appId: "1:430736712384:web:5161ee6b7663f81ed7c325"

};


// ==========================================
// INITIALISER FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// EKSPORTER
// ==========================================

export {

auth,

db,

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

signOut,

collection,

addDoc,

getDocs,

doc,

setDoc,

updateDoc,

onSnapshot,

serverTimestamp

};

console.log("🔥 Firebase koblet til.");