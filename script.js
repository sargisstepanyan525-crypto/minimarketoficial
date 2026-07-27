let allProducts = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. პროდუქტების წაკითხვა products.json-დან
    fetch('products.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(err => {
            console.error(err);
            document.getElementById('product-list').innerHTML = '<p style="color:red;">შეცდომა პროდუქტების ჩატვირთვისას.</p>';
        });

    // 2. ძიების ფუნქციონალი
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
            renderProducts(filtered);
        });
    }

    // 3. კალათის გახსნა/დახურვა
    document.getElementById('open-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);

    // 4. მიწოდების ზონის შეცვლა
    document.getElementById('delivery-zone').addEventListener('change', updateTotal);

    // 5. ბანკის ანგარიშის კოპირება
    document.getElementById('copy-iban-btn').addEventListener('click', copyIBAN);

    // 6. შეკვეთის გაგზავნა
    document.getElementById('send-order-btn').addEventListener('click', sendOrder);
});

// პროდუქტების გამოჩენა
function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p>პროდუქტი ვერ მოიძებნა.</p>';
        return;
    }

    products.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=სურათი+არ+არის'">
            <div class="product-title">${item.name}</div>
            <div class="product-price">${Number(item.price).toFixed(2)} ₾</div>
            <button type="button" class="add-to-cart-btn" onclick="addToCart(${index})">
                <i class="fa-solid fa-cart-plus"></i> დამატება
            </button>
        `;
        container.appendChild(card);
    });
}

// კალათაში დამატება
function addToCart(index) {
    const product = allProducts[index];
    if (!product) return;

    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: product.name,
            price: Number(product.price),
            qty: 1
        });
    }
    updateCartUI();
}

// კალათის განახლება
function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.innerText = totalQty;

    itemsEl.innerHTML = '';

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p>კალათა ცარიელია</p>';
    } else {
        cart.forEach((item, i) => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price.toFixed(2)} ₾ x ${item.qty}</small>
                </div>
                <div class="qty-controls">
                    <button type="button" class="qty-btn" onclick="changeQty(${i}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
                </div>
            `;
            itemsEl.appendChild(row);
        });
    }

    updateTotal();
}

// რაოდენობის შეცვლა კალათაში
function changeQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

// ჯამის დაანგარიშება
function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const zoneSelect = document.getElementById('delivery-zone');
    let deliveryCost = Number(zoneSelect.value);

    // 250 ₾-ზე მეტი შენაძენისას უფასოა
    if (subtotal >= 250) {
        deliveryCost = 0;
    }

    const finalTotal = subtotal + deliveryCost;

    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-price').innerText = deliveryCost.toFixed(2);
    document.getElementById('final-price').innerText = finalTotal.toFixed(2);
}

// კალათის გახსნა/დახურვა
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
}

// IBAN-ის კოპირება
function copyIBAN() {
    const iban = document.getElementById('iban-code').innerText;
    navigator.clipboard.writeText(iban).then(() => {
        alert("ანგარიშის ნომერი კოპირებულია!");
    });
}

// WhatsApp-ზე შეკვეთის გაგზავნა
function sendOrder() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!");
        return;
    }

    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !address) {
        alert("გთხოვთ, მიუთითოთ სახელი და მისამართი!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryCost = Number(document.getElementById('delivery-zone').value);
    if (subtotal >= 250) deliveryCost = 0;
    const finalTotal = subtotal + deliveryCost;

    let text = `🛒 *ახალი შეკვეთა MINI MARKET-იდან!*\n\n`;
    text += `👤 *მყიდველი:* ${name}\n`;
    text += `📍 *მისამართი:* ${address}\n\n`;
    text += `📦 *პროდუქტები:*\n`;

    cart.forEach(item => {
        text += `• ${item.name} (${item.qty}ც) - ${(item.price * item.qty).toFixed(2)} ₾\n`;
    });

    text += `\n💰 *პროდუქტები:* ${subtotal.toFixed(2)} ₾`;
    text += `\n🚚 *მიწოდება:* ${deliveryCost.toFixed(2)} ₾`;
    text += `\n💵 *სულ გადასახდელი:* ${finalTotal.toFixed(2)} ₾\n\n`;
    text += `💳 *გადახდა (ლიბერთი ბანკი):*\nGE46LB0711133103178000`;

    const url = `https://wa.me/995500224822?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
