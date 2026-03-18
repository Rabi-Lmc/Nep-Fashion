// --- Product Data ---
// Using placeholder images for demonstration
const products = [
    { id: 1, name: "Gold Embellished Lehenga", category: "lehenga", price: 18500, img: "img/lehenga.jpg" },
    { id: 2, name: "Classic Crimson Saree", category: "saree", price: 12000, img: "img/Classic Crimson Saree.jpg" },
    { id: 3, name: "Minimalist Beige Kurti", category: "kurti", price: 3500, img: "img/Minimalist Beige Kurti.jpg" },
    { id: 4, name: "Black Velvet Party Gown", category: "party", price: 8500, img: "img/Black Velvet Party Gown.jpg" },
    { id: 5, name: "Pastel Pink Saree", category: "saree", price: 9500, img: "img/Pastel Pink Saree.jpg" },
    { id: 6, name: "Festive Yellow Kurti Set", category: "kurti", price: 4200, img: "img/Festive Yellow Kurti Set.jpg" },
    { id: 7, name: "Royal Blue Lehenga", category: "lehenga", price: 21000, img: "img/Royal Blue Lehenga.jpg" },
    { id: 8, name: "White Aesthetic Dress", category: "party", price: 6000, img: "img/White Aesthetic Dress.jpg" }
];

// --- Global State ---
let cart = JSON.parse(localStorage.getItem('nepFashionCart')) || [];

// --- DOM Elements ---
const productList = document.getElementById('product-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPriceEl = document.getElementById('total-price');

// --- Functions ---

// 1. Render Products
function renderProducts(filter = 'all') {
    productList.innerHTML = '';
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('pro');
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="pro-info">
                <span>${product.category}</span>
                <h5>${product.name}</h5>
                <h4>NPR ${product.price.toLocaleString()}</h4>
            </div>
            <button class="btn primary-btn add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// 2. Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Render filtered
        renderProducts(btn.dataset.filter);
    });
});

// 3. Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    openCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    // Save to local storage
    localStorage.setItem('nepFashionCart', JSON.stringify(cart));
    
    // Update Badge
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Render Cart Items
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:50px;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartDiv = document.createElement('div');
            cartDiv.classList.add('cart-item');
            cartDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="item-details">
                    <h5>${item.name}</h5>
                    <h4>NPR ${item.price.toLocaleString()}</h4>
                    <div class="qty-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            `;
            cartItemsContainer.appendChild(cartDiv);
        });
    }

    // Update Total Price
    totalPriceEl.innerText = `NPR ${total.toLocaleString()}`;
}

// 4. Cart UI Toggles
function openCartUI() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCartUI() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    openCartUI();
});

closeCart.addEventListener('click', closeCartUI);
cartOverlay.addEventListener('click', closeCartUI);

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
});