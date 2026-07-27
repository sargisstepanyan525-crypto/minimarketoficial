let allProducts = [];
let cart = [];

// AI კითხვარის ლოგიკური ეტაპები და მონაცემთა შეგროვება
let currentStep = 0;
let collectedData = {
    fullName: "",
    personalId: "",
    phone: "",
    cityAddress: "",
    floorCode: "",
    deliveryTime: "",
    freshnessReq: "",
    breadType: "",
    allergyNotes: "",
    replacementPolicy: "",
    paymentMethod: "",
    changeRequirement: ""
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. პროდუქტების წამოღება
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
            renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(query)));
        });
    }

    // 3. მოვლენები
    document.getElementById('open-cart-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('copy-iban-btn').addEventListener('click', copyIBAN);
    document.getElementById('ai-send-btn').addEventListener('click', handleUserResponse);
    document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserResponse();
    });
    document.getElementById('whatsapp-final-btn').addEventListener('click', sendFinalToWhatsApp);
});

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
        cart.push({ name: product.name, price: Number(product.price), qty: 1 });
    }
    updateCartBadge();
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryCost = 3.00;
    if (subtotal >= 250 || cart.length === 0) deliveryCost = 0;

    const finalTotal = subtotal + deliveryCost;

    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-price').innerText = deliveryCost.toFixed(2);
    document.getElementById('final-price').innerText = finalTotal.toFixed(2);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">კალათა ცარიელია</p>';
        return;
    }

    cart.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.price.toFixed(2)} ₾ x ${item.qty}</small>
            </div>
            <div>
                <button onclick="changeQty(${i}, -1)">-</button>
                <span style="margin:0 5px;">${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function changeQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        renderCartItems();
        updateCartTotals();
        updateCartBadge();
    }
}

function isWorkingHours() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 10 && hour < 18;
}

// ================= AI & Checkout Flow =================

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!");
        return;
    }

    renderCartItems();
    updateCartTotals();

    const modal = document.getElementById('checkout-modal');
    modal.classList.add('show');

    // Reset Chat state
    currentStep = 0;
    document.getElementById('ai-messages-box').innerHTML = '';
    document.getElementById('whatsapp-final-btn').classList.add('hidden');
    document.getElementById('ai-input-wrapper').classList.remove('hidden');

    if (!isWorkingHours()) {
        appendAIMessage("⛔ გამარჯობა! ამჟამად არასამუშაო საათებია (10:00 - 18:00).\n\nონლაინ შეკვეთების მიღება შეჩერებულია. გთხოვთ გვეწვიოთ მაღაზიაში: **ახალციხე, იაძის ქუჩა #2**!", 'bot');
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        return;
    }

    // AI Welcome Question
    appendAIMessage("გამარჯობა! მე ვარ Mini Market-ის AI კონსულტანტი. 🛒\n\nსიამოვნებით დაგეხმარებით შეკვეთის გაფორმებაში. სანამ პროდუქციას მოვამზადებთ, გთხოვთ მიუთითოთ თქვენი **სახელი და გვარი**:", 'bot');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

const aiQuestions = [
    { key: "fullName", text: "გმადლობთ! ახლა გთხოვთ მიუთითოთ თქვენი **პირადი ნომერი** (უსაფრთხოებისა და იდენტიფიკაციისთვის):" },
    { key: "personalId", text: "შესანიშნავია. რა არის თქვენი **მობილურის ნომერი**, რომ კურიერმა დაკავშირება შეძლოს?" },
    { key: "phone", text: "მადლობა! გთხოვთ ჩამიწეროთ **ზუსტი მისამართი** (ქუჩა, შენობის/სახლის ნომერი):" },
    { key: "cityAddress", text: "ხომ ვერ დააზუსტებთ **სართულს, ბინის ნომერს ან სადარბაზოს კოდს**?" },
    { key: "floorCode", text: "შეკვეთაში გვაქვს მალფუჭებადი/ახალი პროდუქტები. ხორცპროდუქტებსა და რძის ნაწარმზე ხომ არ გაქვთ ვარგისიანობის ვადის განსაკუთრებული მოთხოვნა?" },
    { key: "freshnessReq", text: "პურ-ფუნთუშეულისა და საკონდიტრო ნაწარმის შემთხვევაში, რა სახეობის/ფაქტურის პროდუქტი გირჩევნიათ?" },
    { key: "breadType", text: "ხომ არ აქვს ვინმეს **ალერგია** რომელიმე ინგრედიენტზე (მაგ. ლაქტოზა, გლუტენი, თხილეული)?" },
    { key: "allergyNotes", text: "თუ რომელიმე კონკრეტული ბრენდის პროდუქტი საწყობში არ აღმოჩნდება, გსურთ თუ არა სხვა ექვივალენტური ბრენდით ჩანაცვლება?" },
    { key: "replacementPolicy", text: "როდის გსურთ კურიერის მოსვლა? (გთხოვთ მიუთითოთ **სასურველი დროის ინტერვალი**):" },
    { key: "deliveryTime", text: "გადახდას როგორ გეგმავთ: **ნაღდი ანგარიშსწორებით** კურიერთან თუ **საბანკო გადარიცხვით**?" },
    { key: "paymentMethod", text: "თუ ნაღდი ანგარიშსწორებაა, დასჭირდება თუ არა კურიერს **ხურდის მოტანა** (რა თანხიდან)?" }
];

function handleUserResponse() {
    const inputEl = document.getElementById('ai-user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    appendAIMessage(userText, 'user');
    inputEl.value = '';

    // Save step response
    if (currentStep === 0) {
        collectedData.fullName = userText;
    } else if (currentStep <= aiQuestions.length) {
        const prevQuestion = aiQuestions[currentStep - 1];
        collectedData[prevQuestion.key] = userText;
    }

    currentStep++;

    setTimeout(() => {
        if (currentStep <= aiQuestions.length) {
            // Friendly persuasive smart prompt every 4 steps
            if (currentStep === 4) {
                appendAIMessage("💡 *პატარა რჩევა:* ონლაინ შეკვეთის დეტალური დაზუსტება დროს მოითხოვს. თუ გეჩქარებათ, შეგიძლიათ პირდაპირ მობრძანდეთ ჩვენს მარკეტში **იაძის ქუჩა #2-ში**, სადაც ყველაფერს ადგილზე აარჩევთ!\n\nთუმცა, თუ ონლაინ გსურთ, გავაგრძელოთ 👇", 'bot');
            }
            
            const nextQ = aiQuestions[currentStep - 1];
            appendAIMessage(nextQ.text, 'bot');
        } else {
            // Final Step - All Questions Complete
            appendAIMessage("🎉 **ყველა საჭირო ინფორმაცია მიღებულია!**\n\nთქვენი მონაცემები გადამოწმებულია. ქვემოთ გამოჩნდა ღილაკი, დააჭირეთ და შეკვეთა ავტომატურად გაიგზავნება ჩვენს WhatsApp-ზე!", 'bot');
            document.getElementById('ai-input-wrapper').classList.add('hidden');
            document.getElementById('whatsapp-final-btn').classList.remove('hidden');
        }
    }, 600);
}

function appendAIMessage(text, sender) {
    const box = document.getElementById('ai-messages-box');
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function copyIBAN() {
    const iban = document.getElementById('iban-code').innerText;
    navigator.clipboard.writeText(iban).then(() => {
        alert("ანგარიშის ნომერი კოპირებულია!");
    });
}

function sendFinalToWhatsApp() {
    const itemsText = cart.map(i => `• ${i.name} - ${i.qty}ც (${(i.price * i.qty).toFixed(2)}₾)`).join('\n');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryCost = subtotal >= 250 ? 0 : 3.00;
    const finalTotal = subtotal + deliveryCost;

    const fullMessage = 
`🛒 *ახალი შეკვეთა MINI MARKET-ში*
----------------------------------
👤 *მყიდველი:* ${collectedData.fullName}
🆔 *პირადი №:* ${collectedData.personalId}
📞 *ტელეფონი:* ${collectedData.phone}
📍 *მისამართი:* ${collectedData.cityAddress}
🏢 *სართული/კოდი:* ${collectedData.floorCode}

📦 *პროდუქცია:*
${itemsText}

💰 *პროდუქცია:* ${subtotal.toFixed(2)} ₾
🚚 *მიწოდება:* ${deliveryCost.toFixed(2)} ₾
✅ *სულ ჯამი:* ${finalTotal.toFixed(2)} ₾

📋 *დამატებითი დეტალები:*
• ვარგისიანობის მოთხოვნა: ${collectedData.freshnessReq}
• პურის ტიპი: ${collectedData.breadType}
• ალერგიები: ${collectedData.allergyNotes}
• ჩანაცვლების პოლიტიკა: ${collectedData.replacementPolicy}
• სასურველი დრო: ${collectedData.deliveryTime}
• გადახდის მეთოდი: ${collectedData.paymentMethod}
• ხურდის საჭიროება: ${collectedData.changeRequirement}`;

    const encodedMsg = encodeURIComponent(fullMessage);
    // WhatsApp Direct Link
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
}
