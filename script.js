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

    // 2. ძიება
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
            renderProducts(filtered);
        });
    }

    // 3. კალათის მოვლენები
    document.getElementById('open-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('delivery-zone').addEventListener('change', updateTotal);
    document.getElementById('copy-iban-btn').addEventListener('click', copyIBAN);
    document.getElementById('send-order-btn').addEventListener('click', sendOrder);

    // 4. AI ასისტენტის მოვლენები
    document.getElementById('open-ai-btn').addEventListener('click', toggleAIChat);
    document.getElementById('close-ai-btn').addEventListener('click', toggleAIChat);
    document.getElementById('ai-send-btn').addEventListener('click', handleAISend);
    document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAISend();
    });
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

function changeQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const zoneSelect = document.getElementById('delivery-zone');
    let deliveryCost = Number(zoneSelect.value);

    if (subtotal >= 250) {
        deliveryCost = 0;
    }

    const finalTotal = subtotal + deliveryCost;

    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-price').innerText = deliveryCost.toFixed(2);
    document.getElementById('final-price').innerText = finalTotal.toFixed(2);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
}

function copyIBAN() {
    const iban = document.getElementById('iban-code').innerText;
    navigator.clipboard.writeText(iban).then(() => {
        alert("ანგარიშის ნომერი კოპირებულია!");
    });
}

// შემოწმება: არის თუ არა სამუშაო საათები (10:00 - 18:00)
function isWorkingHours() {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 10 && currentHour < 18;
}

// შეკვეთის გაგზავნა
function sendOrder() {
    // 1. თუ არასამუშაო საათებია (18:00 - 10:00), ბლოკავს გადამისამართებას
    if (!isWorkingHours()) {
        alert("⛔ ბოდიშს გიხდით! მაღაზია ამჟამად დაკეტილია.\n\nონლაინ შეკვეთების მიღება და WhatsApp-ზე გადამისამართება ხდება მხოლოდ 10:00-დან 18:00 საათამდე.\n\nგთხოვთ გვეწვიოთ დილით ან მოხვიდეთ ადგილზე: იაძის ქუჩა #2.");
        return;
    }

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

// ================= AI ჩატის ფუნქციონალი =================

function toggleAIChat() {
    const modal = document.getElementById('ai-chat-modal');
    modal.classList.toggle('show');
}

let aiStep = 0;

function handleAISend() {
    const inputEl = document.getElementById('ai-user-input');
    const msg = inputEl.value.trim();
    if (!msg) return;

    appendAIMessage(msg, 'user');
    inputEl.value = '';

    setTimeout(() => {
        generateAIResponse(msg);
    }, 600);
}

function appendAIMessage(text, sender) {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = `ai-msg ${sender}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// AI პასუხები - ბევრი კითხვა, რომ მყიდველი მაღაზიაში მოვიდეს
function generateAIResponse(userText) {
    if (!isWorkingHours()) {
        appendAIMessage("⛔ ამჟამად არასამუშაო საათებია. მაღაზია მუშაობს 10:00-დან 18:00 საათამდე. ონლაინ შეკვეთები მიიღება მხოლოდ სამუშაო დროში. გთხოვთ გვეწვიოთ დილით იაძის #2-ში!", 'bot');
        return;
    }

    aiStep++;

    const questions = [
        "ონლაინ შეკვეთის გაფორმებამდე რამდენიმე დეტალი უნდა დავაზუსტოთ: ზუსტად რომელი ბრენდის და წონის პროდუქტები გსურთ?",
        "გასაგებია. ასევე, გთხოვთ მიუთითოთ ვარგისიანობის რა მინიმალური ვადა გსურთ ჰქონდეს პროდუქტს და გესაჭიროებათ თუ არა სპეციალური შეფუთვა?",
        "მიღებულია. ხომ ვერ დააზუსტებთ, კურიერს რა დროის შუალედში შეუძლია მოსვლა (მაგალითად 12:00-13:00 თუ 15:00-16:00) და გექნებათ თუ არა ზუსტი ხურდა ადგილზე?",
        "მადლობა. ასევე გვაცნობეთ, პროდუქციის ადგილზე ჩანაცვლება თუ დასაშვებია, თუ რომელიმე პოზიცია არ აღმოჩნდება საწყობში?",
        "ონლაინ შეკვეთის პროცესი საკმაოდ დეტალურ გადამოწმებას მოითხოვს. 💡 *ჩვენი რჩევაა, პირდაპირ მობრძანდეთ მაღაზიაში (იაძის ქუჩა #2)* — ადგილზე ბევრად მარტივად, სწრაფად და დაუყოვნებლივ აირჩევთ ყველაფერს!"
    ];

    if (aiStep <= questions.length) {
        appendAIMessage(questions[aiStep - 1], 'bot');
    } else {
        appendAIMessage("საუკეთესო და ყველაზე სწრაფი გზაა გვეწვიოთ მისამართზე: ქ. ახალციხე, იაძის ქუჩა #2ი. გელოდებით!", 'bot');
    }
}
