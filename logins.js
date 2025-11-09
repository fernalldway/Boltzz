// --- imports (modular) ---
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

    // --- your firebase config (already used in your project) ---
    const firebaseConfig = {
      apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
      authDomain: "sign-2fd98.firebaseapp.com",
      projectId: "sign-2fd98",
      storageBucket: "sign-2fd98.appspot.com",
      messagingSenderId: "548682903618",
      appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
    };

    // --- init ---
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // --- DOM ---
    const emailEl = document.getElementById('email');
    const passEl  = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const forgotBtn = document.getElementById('forgotBtn');
    const spinner = document.getElementById('spinner');
    const popup = document.getElementById('popup');
    const popupMsg = document.getElementById('popupMsg');

    // helper: show popup
    function showPopup(message, type = 'success', duration = 3000) {
      popupMsg.textContent = message;
      popup.className = `popup ${type} show`;
      // hide after duration
      setTimeout(() => {
        popup.classList.remove('show');
      }, duration);
    }

    // helper: enable/disable UI while waiting
    function setLoading(loading) {
      if (loading) {
        spinner.style.display = 'block';
        loginBtn.disabled = true;
        loginBtn.style.opacity = 0.6;
      } else {
        spinner.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.style.opacity = 1;
      }
    }

    // Attempt login
    async function attemptLogin() {
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) {
        showPopup('Please provide email and password', 'error');
        return;
      }

      try {
        setLoading(true);
        const cred = await signInWithEmailAndPassword(auth, email, password);

        // check email verification
        const user = cred.user;
        if (!user.emailVerified) {
          // sign out and notify
          await signOut(auth);
          setLoading(false);
          showPopup('Kindly verify your email before logging in — check your inbox', 'error', 5000);
          return;
        }

        // success — redirect to main.html
        setLoading(false);
        showPopup('Login successful — redirecting...', 'success', 1800);
        setTimeout(() => { window.location.href = 'main.html'; }, 1400);

      } catch (err) {
        setLoading(false);
        // better error messages
        let message = err.message || 'Login failed';
        // map common Firebase errors to friendlier text
        if (err.code === 'auth/user-not-found') message = 'No account for this email';
        if (err.code === 'auth/wrong-password') message = 'Incorrect password';
        if (err.code === 'auth/invalid-email') message = 'Invalid email';
        showPopup(message, 'error', 4000);
      }
    }

    // Forgot password flow
    async function sendReset() {
      const email = emailEl.value.trim();
      if (!email) { showPopup('Enter your email to reset password', 'error'); return; }
      try {
        setLoading(true);
        await sendPasswordResetEmail(auth, email);
        setLoading(false);
        showPopup('Password reset link sent to your email', 'success', 4000);
      } catch (err) {
        setLoading(false);
        let message = err.message || 'Failed to send reset email';
        if (err.code === 'auth/user-not-found') message = 'No account for this email';
        showPopup(message, 'error', 4000);
      }
    }

    // events
    loginBtn.addEventListener('click', attemptLogin);
    forgotBtn.addEventListener('click', sendReset);

    // allow Enter key to submit
    [emailEl, passEl].forEach(el => {
      el.addEventListener('keyup', (e) => { if (e.key === 'Enter') attemptLogin(); });
    });

    // security note: hide popup if user clicks anywhere
    document.addEventListener('click', (e)=> {
      if (!popup.contains(e.target)) popup.classList.remove('show');
    });