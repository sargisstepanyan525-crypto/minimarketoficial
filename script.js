let allProducts = [];
let cart = [];
let customerData = {
    fullName: '',
    address: '',
    idNumber: '',
    phone: '',
    notes: ''
};
let aiStep = 0;

document.addEventListener("DOMContentLoaded", () => {
    // 1. პროდუქტების ჩატვირთვა products.json-დან
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
    
    // კალათიდან პირდაპირ AI-ზე გადასვლა
    document.getElementById('send-order-btn').addEventListener('click', startAIOrderProcess);

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
    let deliveryCost = Number(zoneSelect ? zoneSelect.value : 0);

    if (subtotal >= 250) {
        deliveryCost = 0;
    }

    const finalTotal = subtotal + deliveryCost;

    const subEl = document.getElementById('subtotal-price');
    const delEl = document.getElementById('delivery-price');
    const finEl = document.getElementById('final-price');

    if (subEl) subEl.innerText = subtotal.toFixed(2);
    if (delEl) delEl.innerText = deliveryCost.toFixed(2);
    if (finEl) finEl.innerText = finalTotal.toFixed(2);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
}

function toggleAIChat() {
    const modal = document.getElementById('ai-chat-modal');
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

// ================= AI ოპერატორის პროცესი =================

function startAIOrderProcess() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!");
        return;
    }

    // კალათის დახურვა და AI ჩატის გახსნა
    toggleCart();
    
    const modal = document.getElementById('ai-chat-modal');
    modal.classList.add('show');

    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML = ''; // ჩატის გასუფთავება
    
    // მონაცემების განახლება
    aiStep = 0;
    customerData = { fullName: '', address: '', idNumber: '', phone: '', notes: '' };

    // არასამუშაო საათების შემოწმება (18:00 - 10:00)
    if (!isWorkingHours()) {
        appendAIMessage(`⛔ გამარჯობა!\n\nბოდიშს გიხდით, ამჟამად არასამუშაო საათებია. ონლაინ მიწოდების სერვისი მუშაობს მხოლოდ 10:00-დან 18:00 საათამდე.\n\nღამის საათებში შეკვეთები ვერ დამუშავდება. გთხოვთ გვეწვიოთ დილით 10:00 საათიდან ან მობრძანდეთ მაღაზიაში: **ახალციხე, იაძის ქუჩა #2**!`, 'bot');
        return;
    }

    // სამუშაო საათებში AI იწყებს მონაცემების შეგროვებას
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    appendAIMessage(`გამარჯობა! მე ვარ Mini Market-ის AI ოპერატორი. 🛒\n\nთქვენ აირჩიეთ პროდუქტები ჯამური ღირებულებით: **${subtotal.toFixed(2)} ₾**.\n\nშეკვეთის გასაფორმებლად, გთხოვთ მომწეროთ თქვენი **სახელი და გვარი**:`, 'bot');
    aiStep = 1;
}

function handleAISend() {
    const inputEl = document.getElementById('ai-user-input');
    const msg = inputEl.value.trim();
    if (!msg) return;

    appendAIMessage(msg, 'user');
    inputEl.value = '';

    setTimeout(() => {
        processAISteps(msg);
    }, 500);
}

function appendAIMessage(text, sender) {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = `ai-msg ${sender}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function processAISteps(userText) {
    if (!isWorkingHours()) {
        appendAIMessage("⛔ ამჟამად არასამუშაო საათებია (18:00-10:00). შეკვეთა ვერ გაიგზავნება. გთხოვთ გვეწვიოთ დილით იაძის #2-ში!", 'bot');
        return;
    }

    switch (aiStep) {
        case 1:
            customerData.fullName = userText;
            appendAIMessage(`სასსიამოვნოა, ${customerData.fullName}! 👋\n\nახლა მიუთითეთ **ზუსტი მისამართი** სადაც გსურთ პროდუქციის მიწოდება:`, 'bot');
            aiStep = 2;
            break;

        case 2:
            customerData.address = userText;
            appendAIMessage(`მადლობა. გთხოვთ მომწეროთ თქვენი **პირადი ნომერი (11 ნიშნა)**:`, 'bot');
            aiStep = 3;
            break;

        case 3:
            customerData.idNumber = userText;
            appendAIMessage(`გასაგებია. ახლა მიუთითეთ **მობილურის ტელეფონის ნომერი**:`, 'bot');
            aiStep = 4;
            break;

        case 4:
            customerData.phone = userText;
            appendAIMessage(`გმადლობთ! დამატებით ხომ არ გაქვთ რაიმე სპეციალური მოთხოვნა ან შენიშვნა კურიერისთვის? (მაგ. ხურდის ქონა, პროდუქტის ბრენდი, შენახვის პირობები და ა.შ.)`, 'bot');
            aiStep = 5;
            break;

        case 5:
            customerData.notes = userText;
            
            // დამატებითი რთული შეკითხვები/რჩევა მაღაზიაში მოსვლაზე
            appendAIMessage(`მონაცემები ჩაწერილია! 📝\n\nთუმცა, გაითვალისწინეთ, რომ ონლაინ შეკვეთას სჭირდება დრო, კურიერის ლოდინი და დეტალების შეთანხმება.\n\n💡 **ჩვენი რჩევაა, პირდაპირ მობრძანდეთ მაღაზიაში (ახალციხე, იაძის ქუჩა #2)** — ადგილზე ბევრად მარტივად, სწრაფად და დაუყოვნებლივ აირჩევთ ყველაფერს!`, 'bot');
            aiStep = 6;
            break;

        case 6:
            // საბოლოო დასტური
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            let itemsListStr = cart.map(i => `• ${i.name} (${i.qty}ც) - ${(i.price * i.qty).toFixed(2)}₾`).join('\n');
            
            let summaryMsg = `თუ მაინც გსურთ ონლაინ გაგზავნა, აი თქვენი შეკვეთის რეზიუმე:\n\n` +
                `👤 მყიდველი: ${customerData.fullName}\n` +
                `📍 მისამართი: ${customerData.address}\n` +
                `🆔 პირადი №: ${customerData.idNumber}\n` +
                `📞 ტელეფონი: ${customerData.phone}\n` +
                `💬 შენიშვნა: ${customerData.notes}\n\n` +
                `🛒 კალათა:\n${itemsListStr}\n` +
                `💰 სულ: ${subtotal.toFixed(2)} ₾\n\n` +
                `📍 მაღაზია: იაძის ქუჩა #2ი`;

            appendAIMessage(summaryMsg, 'bot');
            aiStep = 7;
            break;

        default:
            appendAIMessage(`თქვენი მონაცემები მიღებულია! ონლაინ პროცესის დაყოვნების თავიდან ასაცილებლად გელით მაღაზიაში: **იაძის ქუჩა #2**! 🛍️`, 'bot');
            break;
    }
}
