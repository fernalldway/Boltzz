import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
  authDomain: "sign-2fd98.firebaseapp.com",
  projectId: "sign-2fd98",
  storageBucket: "sign-2fd98.appspot.com",
  messagingSenderId: "548682903618",
  appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning🌅";
    if (hour < 17) return "Good Afternoon☀️";
    return "Good Evening🌃";
  }

  document.getElementById("greeting").textContent = `${getGreeting()} ${user.email}`;
});
