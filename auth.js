import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// 3. Google Auth Logic
export const handleGoogleAuth = () => {
    return signInWithPopup(auth, provider);
};

// 4. Unified Upload Logic
export const uploadProductWithImage = async (imageFile, productData) => {
    try {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "products"), {
            ...productData,
            img: imageURL, 
            createdAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};

// 5. Exports (Only variables not already exported above)
export { 
    db, 
    storage, 
    auth, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
};

// 6. Login Button Listener (Runs only on Login Page)
// Make sure your login.html button has id="google-login"
const loginBtn = document.getElementById('google-login');

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            loginBtn.innerText = "Connecting...";
            loginBtn.disabled = true;

            const result = await handleGoogleAuth();
            alert("Namaste, " + result.user.displayName + "!");
            window.location.href = "admin.html"; // Redirect to admin after login

        } catch (error) {
            console.error("Auth Error:", error);
            alert("Login failed. Check your Firebase Authorized Domains!");
            loginBtn.innerHTML = `
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" style="width:20px; margin-right:10px;">
                Login with Google
            `;
            loginBtn.disabled = false;
        }
    });
}