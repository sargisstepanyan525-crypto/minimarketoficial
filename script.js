let allProducts = [];
let cart = [];

// AI დიალოგის მდგომარეობა
let aiOrderData = {
    cartItems: [],
    subtotal: 0,
    deliveryCost: 0,
    finalTotal: 0,
    fullName: "",
    phone: "",
    address: "",
    idNumber: "",
    payMethod: "",
    changeNeeded: "",
    preferredTime: "",
    replacementOk: "",
    courierNote: "",
    receiptType: "",
    confirmed: false
};

let currentQuestionStep = 0;

document.addEventListener("DOMContentLoaded", () => {
    // 1. პროდუქტების ჩატვირთვა
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

    // 3. კალათა და AI ჩატის ღილაკები
    document.getElementById('open-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('delivery-zone').addEventListener('change', updateTotal);
    document.getElementById('copy-iban-btn').addEventListener('click', copyIBAN);
    
    // კალათიდან AI-ზე გადასვლის ღილაკი
    document.getElementById('send-order-btn').addEventListener('click', startAIOrderProcess);

    // AI ჩატის ელემენტები
    document.getElementById('open-ai-btn').addEventListener('click', toggleAIChat);
    document.getElementById('close-ai-btn').addEventListener('click', toggleAIChat);
    document.getElementById('ai-send-btn').addEventListener('click', handleAISend);
    document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAISend();
    });
});

// პროდუქტების რენდერი
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

// ================= AI ასისტენტის ინტერაქციული ლოგიკა =================

function startAIOrderProcess() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let deliveryCost = Number(document.getElementById('delivery-zone').value);
    if (subtotal >= 250) deliveryCost = 0;
    const finalTotal = subtotal + deliveryCost;

    aiOrderData = {
        cartItems: [...cart],
        subtotal: subtotal,
        deliveryCost: deliveryCost,
        finalTotal: finalTotal,
        fullName: "",
        phone: "",
        address: "",
        idNumber: "",
        payMethod: "",
        changeNeeded: "",
        preferredTime: "",
        replacementOk: "",
        courierNote: "",
        receiptType: "",
        confirmed: false
    };

    currentQuestionStep = 0;

    // კალათის დახურვა და AI ჩატის გახსნა
    toggleCart();
    const modal = document.getElementById('ai-chat-modal');
    modal.classList.add('show');

    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML = '';

    // სამუშაო საათების შემოწმება
    if (!isWorkingHours()) {
        appendAIMessage(`გამარჯობა! 👋 მადლობა, რომ დაინტერესდით ჩვენი პროდუქციით.\n\nსამწუხაროდ, ამჟამად არასამუშაო საათებია. ჩვენი მაღაზია და ონლაინ მიწოდების სერვისი მუშაობს **10:00-დან 18:00 საათამდე**.\n\nახლა შეკვეთას ვერ გავაფორმებთ, თუმცა ძალიან გავეხარდებით, თუ გვეწვევით დილით 10:00 საათიდან ან მობრძანდებით ჩვენს მაღაზიაში ადგილზე:\n📍 **მისამართი: იაძის ქუჩა #2, ახალციხე**.`, 'bot');
        return;
    }

    // AI იწყებს საუბარს
    appendAIMessage(`გამარჯობა! 🌿 მე ვარ Mini Market-ის ონლაინ ასისტენტი. ძალიან მიხარია, რომ ჩვენი პროდუქცია აირჩიეთ!\n\nთქვენს კალათაშია ${cart.length} დასახელების პროდუქტი, ჯამური ღირებულებით **${finalTotal.toFixed(2)} ₾**.\n\nშეკვეთა რომ ზუსტად და შეუფერხებლად მოგიტანოთ, რამდენიმე დეტალს დავაზუსტებ. პირველ რიგში, გთხოვთ მიუთითოთ თქვენი **სახელი და გვარი**?`, 'bot');
    currentQuestionStep = 1;
}

function handleAISend() {
    const inputEl = document.getElementById('ai-user-input');
    const msg = inputEl.value.trim();
    if (!msg) return;

    appendAIMessage(msg, 'user');
    inputEl.value = '';

    setTimeout(() => {
        processAIResponse(msg);
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

function processAIResponse(userInput) {
    if (!isWorkingHours()) {
        appendAIMessage("გთხოვთ გაითვალისწინოთ, რომ ამჟამად არასამუშაო საათებია (10:00-18:00). გოდებთ დილით იაძის #2-ში!", 'bot');
        return;
    }

    // 10-12 ეტაპიანი კითხვარი
    switch (currentQuestionStep) {
        case 1:
            aiOrderData.fullName = userInput;
            appendAIMessage(`სასიამოვნოა თქვენი გაცნობა, ${aiOrderData.fullName}! 😊\n\nახლა გთხოვთ მომწეროთ თქვენი **მობილურის ნომერი**, რომ კურიერმა დაკავშირება შეძლოს.`, 'bot');
            currentQuestionStep = 2;
            break;

        case 2:
            aiOrderData.phone = userInput;
            appendAIMessage(`ძალიან კარგი! 📞 ახლა მიუთითეთ **ზუსტი მისამართი** (ქუჩა, სახლი/კორპუსი, სადარბაზო, სართული, ბინა).`, 'bot');
            currentQuestionStep = 3;
            break;

        case 3:
            aiOrderData.address = userInput;
            appendAIMessage(`მადლობა! საბუღალტრო აღრიცხვისა და ქვითრისთვის, თუ საიდუმლო არ არის, გთხოვთ მიუთითოთ თქვენი **პირადი ნომერი**?`, 'bot');
            currentQuestionStep = 4;
            break;

        case 4:
            aiOrderData.idNumber = userInput;
            appendAIMessage(`გასაგებია. გადახდას როგორ ისურვებთ? 💳\n\n1) ნაღდი ანგარიშსწორება კურიერთან\n2) საბანკო გადარიცხვა (ბარათით)`, 'bot');
            currentQuestionStep = 5;
            break;

        case 5:
            aiOrderData.payMethod = userInput;
            appendAIMessage(`შესანიშნავია. ნაღდი ანგარიშსწორებისას ან ბარათის შემთხვევაში, **დაგჭირდებათ თუ არა ხურდა** და რამდენიანი კუპიურიდან?`, 'bot');
            currentQuestionStep = 6;
            break;

        case 6:
            aiOrderData.changeNeeded = userInput;
            appendAIMessage(`დიდი მადლობა. **რომელ საათებში გირჩევნიათ მიწოდება?** (მაგალითად: უახლოეს 1 საათში, 14:00-დან 16:00-მდე და ა.შ.)`, 'bot');
            currentQuestionStep = 7;
            break;

        case 7:
            aiOrderData.preferredTime = userInput;
            appendAIMessage(`თუ რომელიმე არჩეული პროდუქტი საწყობში დროებით არ აღმოჩნდა, **გსურთ თუ არა მსგავსი ალტერნატივით ჩანაცვლება**, თუ უბრალოდ ამოვიღოთ შეკვეთიდან?`, 'bot');
            currentQuestionStep = 8;
            break;

        case 8:
            aiOrderData.replacementOk = userInput;
            appendAIMessage(`გავითვალისწინე. ხომ არ გაქვთ რაიმე **დამატებითი მითითება კურიერისთვის**? (მაგ. ეზოში ძაღლია, ეზოს კარზე დარეკეთ, ლიფტი არ მუშაობს და ა.შ.)`, 'bot');
            currentQuestionStep = 9;
            break;

        case 9:
            aiOrderData.courierNote = userInput;
            appendAIMessage(`თითქმის მზად ვართ! 🧾 ქვითარი გსურთ **ელექტრონულად (SMS/WhatsApp-ით)** თუ **ამონაბეჭდი** პროდუქტთან ერთად?`, 'bot');
            currentQuestionStep = 10;
            break;

        case 10:
            aiOrderData.receiptType = userInput;
            
            // შეჯამება
            let summary = `✨ **შეკვეთის შეჯამება:**\n\n`;
            summary += `👤 **მყიდველი:** ${aiOrderData.fullName}\n`;
            summary += `📞 **ტელეფონი:** ${aiOrderData.phone}\n`;
            summary += `📍 **მისამართი:** ${aiOrderData.address}\n`;
            summary += `🆔 **პირადი ნომერი:** ${aiOrderData.idNumber}\n`;
            summary += `💳 **გადახდა:** ${aiOrderData.payMethod}\n`;
            summary += `💵 **ხურდა:** ${aiOrderData.changeNeeded}\n`;
            summary += `⏰ **დრო:** ${aiOrderData.preferredTime}\n`;
            summary += `🔄 **ჩანაცვლება:** ${aiOrderData.replacementOk}\n`;
            summary += `📝 **შენიშვნა:** ${aiOrderData.courierNote}\n`;
            summary += `🧾 **ქვითარი:** ${aiOrderData.receiptType}\n\n`;
            summary += `💰 **სულ გადასახდელი:** ${aiOrderData.finalTotal.toFixed(2)} ₾\n\n`;
            summary += `ყველაფერი სწორად არის მითითებული? გთხოვთ დამიდასტუროთ (დიახ / არა).`;

            appendAIMessage(summary, 'bot');
            currentQuestionStep = 11;
            break;

        case 11:
            if (userInput.toLowerCase().includes('დიახ') || userInput.toLowerCase().includes('კი') || userInput.toLowerCase().includes('სწორია')) {
                aiOrderData.confirmed = true;
                
                appendAIMessage(`🎉 შესანიშნავია! ყველა მონაცემი შეგროვებულია.\n\nახლა შეგიძლიათ დააჭიროთ ქვემოთ მოცემულ ღილაკს და შეკვეთა პირდაპირ გადაიგზავნება ოპერატორის WhatsApp-ზე! 🚀`, 'bot');
                
                showWhatsAppButton();
            } else {
                appendAIMessage(`თუ რომელიმე მონაცემი არასწორია, გთხოვთ მომწეროთ რა შევცვალო, ან თავიდან დავიწყოთ.`, 'bot');
            }
            break;

        default:
            appendAIMessage(`შეკვეთა უკვე მომზადებულია. შეგიძლიათ გააგზავნოთ WhatsApp-ის ღილაკით!`, 'bot');
            break;
    }
}

// WhatsApp-ის ღილაკის გამოჩენა AI ჩატში
function showWhatsAppButton() {
    const container = document.getElementById('ai-messages');
    
    // პროდუქტების სიის ტექსტი
    let itemsText = aiOrderData.cartItems.map(item => `• ${item.name} (${item.qty}x) - ${(item.price * item.qty).toFixed(2)}₾`).join('\n');

    let waText = `🛍️ *ახალი შეკვეთა MINI MARKET-დან*\n\n`;
    waText += `👤 *სახელი:* ${aiOrderData.fullName}\n`;
    waText += `📞 *ტელეფონი:* ${aiOrderData.phone}\n`;
    waText += `📍 *მისამართი:* ${aiOrderData.address}\n`;
    waText += `🆔 *პირადი №:* ${aiOrderData.idNumber}\n`;
    waText += `💳 *გადახდა:* ${aiOrderData.payMethod}\n`;
    waText += `💵 *ხურდა:* ${aiOrderData.changeNeeded}\n`;
    waText += `⏰ *სასურველი დრო:* ${aiOrderData.preferredTime}\n`;
    waText += `🔄 *ჩანაცვლება:* ${aiOrderData.replacementOk}\n`;
    waText += `📝 *კურიერის შენიშვნა:* ${aiOrderData.courierNote}\n`;
    waText += `🧾 *ქვითარი:* ${aiOrderData.receiptType}\n\n`;
    waText += `🛒 *პროდუქტები:*\n${itemsText}\n\n`;
    waText += `💵 *პროდუქტები:* ${aiOrderData.subtotal.toFixed(2)} ₾\n`;
    waText += `🚚 *მიწოდება:* ${aiOrderData.deliveryCost.toFixed(2)} ₾\n`;
    waText += `💰 *სულ ჯამი:* ${aiOrderData.finalTotal.toFixed(2)} ₾`;

    const encodedText = encodeURIComponent(waText);
    const whatsappUrl = `https://wa.me/995555123456?text=${encodedText}`; // შეცვალეთ თქვენი ნომრით

    const btnDiv = document.createElement('div');
    btnDiv.style.textAlign = 'center';
    btnDiv.style.marginTop = '15px';
    btnDiv.innerHTML = `
        <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            <i class="fa-brands fa-whatsapp"></i> შეკვეთის გაგზავნა WhatsApp-ზე
        </a>
    `;
    container.appendChild(btnDiv);
    container.scrollTop = container.scrollHeight;
}
