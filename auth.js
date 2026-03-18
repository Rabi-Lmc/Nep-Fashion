import { db, collection, query, orderBy, onSnapshot, uploadProductWithImage } from "./auth.js";

// Match the IDs from your admin.html
const adminForm = document.getElementById('upload-form');
const imageInput = document.getElementById('p-file');
const imagePreview = document.getElementById('image-preview');
const previewBox = document.getElementById('preview-box');

// --- 1. Show a preview when you select a file ---
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            if (previewBox) previewBox.style.display = 'block';
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// --- 2. Real-Time Sync (Optional: To see your own changes live on dashboard) ---
const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    console.log("Database updated! New product count:", snapshot.size);
    // You can use this to refresh an admin "Recent Uploads" list if you have one
});

// --- 3. Handle the Form Submission ---
adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const imageFile = imageInput.files[0];
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const category = document.getElementById('p-cat').value;

    if (!imageFile) {
        alert("Please select an image first!");
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Uploading to Nep Fashion...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    try {
        const productData = {
            name: name,
            price: Number(price), 
            category: category
        };

        // This function handles the double-step: Storage Upload -> Firestore Save
        const success = await uploadProductWithImage(imageFile, productData);

        if (success) {
            adminForm.reset();
            if (previewBox) previewBox.style.display = 'none';
            imagePreview.src = "#";
            alert("Success! Your new product is now live on the website.");
        }
    } catch (error) {
        console.error("Dashboard Error:", error);
        alert("Upload failed. Check your internet or Admin permissions!");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
    }
});