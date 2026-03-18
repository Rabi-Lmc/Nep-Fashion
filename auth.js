import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- ADMIN SETTINGS ---
const ADMIN_EMAIL = "w33604031@gmail.com"; // 👈 CHANGE THIS to your actual email

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkMmkdBtaqxPYl-8F3ctx1s5AO60ZXR8E",
  authDomain: "nep-fashion.firebaseapp.com",
  projectId: "nep-fashion",
  storageBucket: "nep-fashion.firebasestorage.app",
  messagingSenderId: "966946535777",
  appId: "1:966946535777:web:12c3e0b0d10f88df0ead20"
};

// 2. Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
const provider = new GoogleAuthProvider();


// --- 🛡️ THE GATEKEEPER (SECURITY CHECK) ---
// This checks the current URL. If it's admin.html, it verifies your email.
if (window.location.pathname.includes("admin.html")) {
    onAuthStateChanged(auth, (user) => {
        if (!user || user.email !== ADMIN_EMAIL) {
            alert("Unauthorized access! Returning to shop...");
            window.location.href = "index.html";
        }
    });
}

// 3. Google Auth Logic
export const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Welcome:", result.user.displayName);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Auth Error:", error.message);
            alert("Login failed. Check your internet!");
        });
};

// 4. Logout Logic
export const logoutUser = () => {
    signOut(auth).then(() => {
        window.location.reload();
    });
};

// 5. Admin Upload Logic (Saves to Firestore)
export const uploadProduct = async (productData) => {
    try {
        await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: serverTimestamp()
        });
        alert("Success! The new dress is now live on Nep Fashion.");
        return true;
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Failed to upload product.");
        return false;
    }
};

// 6. Global Auth Listener (UI Updates)
onAuthStateChanged(auth, (user) => {
    const authLink = document.getElementById('auth-link');
    const adminBtn = document.getElementById('admin-nav-item'); 

    if (user) {
        if (authLink) {
            authLink.innerHTML = `<a href="#" id="logout-btn">Logout (${user.displayName.split(' ')[0]})</a>`;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    logoutUser();
                };
            }
        }

        // Show Admin Dashboard link ONLY for you
        if (user.email === ADMIN_EMAIL) {
            if (adminBtn) adminBtn.style.display = "block";
        }
    } else {
        if (authLink) authLink.innerHTML = `<a href="login.html">Login</a>`;
        if (adminBtn) adminBtn.style.display = "none";
    }
});

// Attach listeners to buttons with 'google-btn' class
document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', handleGoogleAuth);
});

export { db };