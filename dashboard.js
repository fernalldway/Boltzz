import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "login.html";

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  let data = userSnap.data();
  document.getElementById("balance").innerText = "₦" + (data.balance ?? 0);
  document.getElementById("refCode").innerText = data.referralCode ?? "N/A";

  const refLink = `${window.location.origin}/signup.html?ref=${data.referralCode}`;
  document.getElementById("refLinkVal").innerText = refLink;
  document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(refLink);
    alert("Referral link copied ✅");
  };

  const q = query(collection(db, "users"), where("referredBy", "==", data.referralCode));
  const results = await getDocs(q);
  document.getElementById("refCount").innerText = results.size;

  const list = document.getElementById("refList");
  results.forEach(u => {
    let li = document.createElement("li");
    li.textContent = u.data().email;
    list.appendChild(li);
  });

  const txSnap = await getDocs(collection(db, "users", user.uid, "transactions"));
  const txList = document.getElementById("txList");
  txSnap.forEach(t => {
    let d = t.data();
    let li = document.createElement("li");
    li.textContent = `${d.type.toUpperCase()} - ₦${d.amount} (${d.time})`;
    txList.appendChild(li);
  });
});
