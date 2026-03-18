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

// 4. Unified Upload Logic (Storage + Firestore)
export const uploadProductWithImage = async (imageFile, productData) => {
    try {
        // A. Upload Image to Firebase Storage
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageURL = await getDownloadURL(snapshot.ref);

        // B. Save Product Data to Firestore
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

// 5. Exports for other files
export { 
    db, storage, auth, collection, query, orderBy, onSnapshot 
};