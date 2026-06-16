const productsInventory = [
    { id: 101, name: "Mechanical Gaming Keyboard", price: 89.99 },
    { id: 102, name: "Wireless Ergonomic Mouse", price: 49.99 },
    { id: 103, name: "UltraWide 4K Monitor Split", price: 299.99 },
    { id: 104, name: "Premium Noise-Cancelling Headphones", price: 159.99 }
];


let cartArray = [];
let activeDiscountPercent = 0;


const validCoupons = {
    "SAVE10": 10,
    "DEV20": 20
};

const catalogGrid = document.getElementById('catalogGrid');
const cartItemsList = document.getElementById('cartItemsList');
const subtotalVal = document.getElementById('subtotalVal');
const taxVal = document.getElementById('taxVal');
const totalVal = document.getElementById('totalVal');
const discountRow = document.getElementById('discountRow');
const discountVal = document.getElementById('discountVal');
const promoInput = document.getElementById('promoInput');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoFeedback = document.getElementById('promoFeedback');
const checkoutBtn = document.getElementById('checkoutBtn');


function renderCatalog() {
    catalogGrid.innerHTML = productsInventory.map(prod => `
        <div class="product-card">
            <div>
                <h3>${prod.name}</h3>
                <div class="product-price">$${prod.price.toFixed(2)}</div>
            </div>
            <button class="add-btn" onclick="addToCart(${prod.id})">Add to Order</button>
        </div>
    `).join('');
}


window.addToCart = function(productId) {
    const existingItem = cartArray.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const productData = productsInventory.find(p => p.id === productId);
        cartArray.push({ ...productData, quantity: 1 });
    }
    updateCartDOM();
};


window.changeQty = function(productId, delta) {
    const targetItem = cartArray.find(item => item.id === productId);
    if (!targetItem) return;

    targetItem.quantity += delta;
    
    if (targetItem.quantity <= 0) {
        cartArray = cartArray.filter(item => item.id !== productId);
    }
    updateCartDOM();
};


function updateCartDOM() {
    if (cartArray.length === 0) {
        cartItemsList.innerHTML = `<p class="empty-msg">Your cart is currently empty. Add items to calculate totals!</p>`;
        checkoutBtn.disabled = true;
        subtotalVal.textContent = "$0.00";
        taxVal.textContent = "$0.00";
        totalVal.textContent = "$0.00";
        discountRow.style.display = "none";
        return;
    }

    checkoutBtn.disabled = false;
    

    cartItemsList.innerHTML = cartArray.map(item => `
        <div class="cart-item-row">
            <div>
                <div style="font-size: 14px; font-weight: 600;">${item.name}</div>
                <div style="font-size: 12px; color: #9ca3af;">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="item-qty-controls">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');


    const subtotal = cartArray.reduce((acc, current) => acc + (current.price * current.quantity), 0);
    const deductionAmount = subtotal * (activeDiscountPercent / 100);
    const postDiscountPrice = subtotal - deductionAmount;
    const taxCalculation = postDiscountPrice * 0.18; 
    const absoluteTotalDue = postDiscountPrice + taxCalculation;


    subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    taxVal.textContent = `$${taxCalculation.toFixed(2)}`;
    totalVal.textContent = `$${absoluteTotalDue.toFixed(2)}`;

    if (deductionAmount > 0) {
        discountRow.style.display = "flex";
        discountVal.textContent = `-$${deductionAmount.toFixed(2)}`;
    } else {
        discountRow.style.display = "none";
    }
}


applyPromoBtn.addEventListener('click', () => {
    const inputString = promoInput.value.trim().toUpperCase();
    
    if (validCoupons.hasOwnProperty(inputString)) {
        activeDiscountPercent = validCoupons[inputString];
        promoFeedback.style.color = "var(--accent-emerald)";
        promoFeedback.style.textContent = `Success! ${activeDiscountPercent}% discount applied.`;
        promoFeedback.innerText = `Success! ${activeDiscountPercent}% discount applied.`;
    } else {
        activeDiscountPercent = 0;
        promoFeedback.style.color = "var(--accent-coral)";
        promoFeedback.innerText = "Invalid promo coupon string code.";
    }
    updateCartDOM();
});

renderCatalog();
