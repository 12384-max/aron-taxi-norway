/* ==================================================
   ARON TAXI NORWAY V2.0
   APP.JS - DEL 1
================================================== */

// Loader
window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

    }, 1200);

});

// Header scroll
const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

// Mobilmeny
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navbar.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});

// Aktiv side i menyen
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("#navbar a").forEach(link => {

    const href = link.getAttribute("href");

    if (href === currentPage || (currentPage === "" && href === "index.html")) {

        link.classList.add("active");

    }

});/* ==================================================
   APP.JS - DEL 2
================================================== */

// ==============================
// SCROLL ANIMATION
// ==============================

const fadeElements = document.querySelectorAll(
".section-title,.action-card,.feature-card,.stat-box,.cta,.footer-top"
);

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{

threshold:0.15

});

fadeElements.forEach(element=>{

element.classList.add("fade-up");

observer.observe(element);

});

// ==============================
// COUNTER
// ==============================

const counters=document.querySelectorAll(".stat-box h2");

const counterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting)return;

const counter=entry.target;

const target=counter.innerText;

const number=parseInt(target.replace(/\D/g,""));

const suffix=target.replace(/[0-9]/g,"");

let count=0;

const speed=Math.max(15,Math.floor(number/80));

const timer=setInterval(()=>{

count+=speed;

if(count>=number){

count=number;

clearInterval(timer);

}

counter.innerText=count+suffix;

},20);

counterObserver.unobserve(counter);

});

});

counters.forEach(counter=>{

counterObserver.observe(counter);

});/* ==================================================
   APP.JS - DEL 3
================================================== */

// ==============================
// TOAST NOTIFICATION
// ==============================

function showToast(title, message, type = "success") {

    const oldToast = document.querySelector(".toast");

    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <div class="toast-icon">
            ${type === "success" ? "✅" : "⚠️"}
        </div>

        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(toast);

    // Spill av lyd
    const audio = new Audio("sounds/notification.mp3");
    audio.volume = 0.4;

    audio.play().catch(() => {});

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 500);

    }, 3500);

}

// ==============================
// BACK TO TOP
// ==============================

const topButton = document.createElement("button");

topButton.id = "backToTop";

topButton.innerHTML =
'<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.classList.add("show");

    } else {

        topButton.classList.remove("show");

    }

});

topButton.onclick = () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

// ==============================
// DEMO
// ==============================

// Fjern denne senere
setTimeout(()=>{

showToast(

"Velkommen!",

"Takk for at du besøker Aron Taxi Norway."

);

},1800);/* ==================================================
   APP.JS - DEL 4
================================================== */

// ==============================
// HEADER EFFECT
// ==============================

window.addEventListener("scroll",()=>{

const header=document.getElementById("header");

if(window.scrollY>60){

header.classList.add("header-active");

}else{

header.classList.remove("header-active");

}

});

// ==============================
// ACTIVE NAV LINK
// ==============================

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll("#navbar a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-150;

const height=section.offsetHeight;

if(pageYOffset>=top){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#" + current){

link.classList.add("active");

}

});

});

// ==============================
// RIPPLE EFFECT
// ==============================

document.querySelectorAll(".primary-btn,.secondary-btn").forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

const diameter=Math.max(this.clientWidth,this.clientHeight);

circle.style.width=circle.style.height=diameter+"px";

circle.style.left=e.offsetX-diameter/2+"px";

circle.style.top=e.offsetY-diameter/2+"px";

circle.classList.add("ripple");

this.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});

// ==============================
// SHORTCUTS
// ==============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

const navbar=document.getElementById("navbar");

navbar.classList.remove("active");

}

});/* ==================================================
   APP.JS - DEL 5
================================================== */

// ==============================
// GREETING
// ==============================

const hour = new Date().getHours();

let greeting = "Velkommen";

if (hour >= 5 && hour < 12) {

    greeting = "God morgen ☀️";

} else if (hour >= 12 && hour < 18) {

    greeting = "God ettermiddag 🌤️";

} else {

    greeting = "God kveld 🌙";

}

console.log(greeting);

// ==============================
// SOUND
// ==============================

let soundEnabled = true;

window.toggleSound = function () {

    soundEnabled = !soundEnabled;

    showToast(

        "Lyd",

        soundEnabled
            ? "Varslingslyd er aktivert."
            : "Varslingslyd er deaktivert."

    );

};

// ==============================
// PLAY SOUND
// ==============================

window.playNotificationSound = function () {

    if (!soundEnabled) return;

    const audio = new Audio("sounds/notification.mp3");

    audio.volume = 0.4;

    audio.play().catch(() => {});

};

// ==============================
// BUTTON EFFECT
// ==============================

document.querySelectorAll(".primary-btn,.secondary-btn,.login-btn").forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-3px) scale(1.02)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "";

    });

});

// ==============================
// PAGE FADE
// ==============================

document.body.classList.add("page-loaded");