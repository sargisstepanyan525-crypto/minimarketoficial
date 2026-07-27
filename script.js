   let allProducts = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    // products.json წაკითხვა ძველი სახით
    fetch('products.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            renderProducts(allProducts);
        })
        .catch(err => {
            document.getElementById('product-list').innerHTML = '<p style="color:red;">შეცდომა პროდუქტების ჩატვირთვისას.</p>';
        });

    // ჭკვიანი ძიება
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
        renderProducts(filtered);
    });
});

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>პროდუქტი ვერ მოიძებნა.</p>';
        return;
    }

    products.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=სურათი+არ+არის'">
            <div class="product-title">${item.name}</div>
            <div class="product-price">${parseFloat(item.price).toFixed(2)} ₾</div>
            <button class="add-to-cart-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price})">
                <i class="fa-solid fa-cart-plus"></i> დამატება
            </button>
        `;
        productList.appendChild(card);
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.innerText = totalItems;

    itemsEl.innerHTML = '';
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p>კალათა ცარიელია</p>';
    } else {
        cart.forEach((item, index) => {
            itemsEl.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.price.toFixed(2)} ₾ x ${item.qty}</small>
                    </div>
                    <div>
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        });
    }
    updateTotal();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function updateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliverySelect = document.getElementById('delivery-zone');
    let deliveryCost = parseFloat(deliverySelect.value);

    // 250 ლარზე მეტზე უფასო მიწოდება
    if (subtotal >= 250) {
        deliveryCost = 0;
    }

    let finalTotal = subtotal + deliveryCost;

    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-price').innerText = deliveryCost.toFixed(2);
    document.getElementById('final-price').innerText = finalTotal.toFixed(2);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function copyIBAN() {
    const iban = document.getElementById('iban-code').innerText;
    navigator.clipboard.writeText(iban);
    alert("ანგარიშის ნომერი კოპირებულია!");
}

function sendOrder() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტები კალათაში!");
        return;
    }

    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !address) {
        alert("გთხოვთ შეავსოთ სახელი და მისამართი!");
        return;
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryCost = parseFloat(document.getElementById('delivery-zone').value);
    if (subtotal >= 250) deliveryCost = 0;
    let finalTotal = subtotal + deliveryCost;

    let message = `🛒 *ახალი შეკვეთა MINI MARKET-იდან!*\n\n`;
    message += `👤 *მყიდველი:* ${name}\n`;
    message += `📍 *მისამართი:* ${address}\n\n`;
    message += `📦 *პროდუქტების სია:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} (${item.qty} ცალი) - ${(item.price * item.qty).toFixed(2)} ₾\n`;
    });

    message += `\n💰 *პროდუქტები:* ${subtotal.toFixed(2)} ₾`;
    message += `\n🚚 *მიწოდება:* ${deliveryCost.toFixed(2)} ₾`;
    message += `\n💵 *სულ გადასახდელი:* ${finalTotal.toFixed(2)} ₾\n\n`;
    message += `💳 *გადახდის ანგარიში (ლიბერთი):*\nGE46LB0711133103178000`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/995500224822?text=${encodedMessage}`, '_blank');
}      
