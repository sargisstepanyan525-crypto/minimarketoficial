let allProducts = [];
let cart = [];

// AI კითხვარის ლოგიკური ეტაპები და მონაცემთა შეგროვება
let currentStep = 0;
let deliveryCost = 3.00; // ნაგულისხმევი (ქალაქი)

let collectedData = {
    fullName: "",
    personalId: "",
    phone: "",
    locationType: "", // ქალაქი თუ სოფელი
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
    let currentDelivery = deliveryCost;
    
    if (subtotal >= 250 || cart.length === 0) {
        currentDelivery = 0;
    }

    const finalTotal = subtotal + currentDelivery;

    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('delivery-price').innerText = currentDelivery.toFixed(2);
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

    deliveryCost = 3.00; // Reset default delivery
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

// AI Questions Chain
const aiQuestions = [
    { 
        key: "fullName", 
        text: "გმადლობთ! ახლა გთხოვთ მიუთითოთ თქვენი **პირადი ნომერი** (ზუსტად 11 ციფრი):",
        validate: (input) => {
            const clean = input.replace(/\D/g, '');
            if (clean.length !== 11) {
                return "⚠️ **შეცდომა:** პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან! გთხოვთ ჩაწერთ ხელახლა.";
            }
            return null;
        },
        format: (input) => input.replace(/\D/g, '')
    },
    { 
        key: "personalId", 
        text: "შესანიშნავია. რა არის თქვენი **მობილურის ნომერი**? (მაგ: 599123456 - 9 ციფრი):",
        validate: (input) => {
            const clean = input.replace(/\D/g, '');
            if (clean.length !== 9) {
                return "⚠️ **შეცდომა:** ტელეფონის ნომერი არასწორია ან მოკლეა! უნდა იყოს ზუსტად 9 ციფრი (მაგ: 599123456).";
            }
            return null;
        },
        format: (input) => input.replace(/\D/g, '')
    },
    { 
        key: "phone", 
        text: "გთხოვთ აირჩიოთ მიწოდების ზონა: **1. ქალაქში (3₾)** თუ **2. სოფელში/გარეუბანში (8₾)**? (მიუთითეთ: ქალაქი ან სოფელი):",
        validate: (input) => {
            const val = input.toLowerCase();
            if (!val.includes("ქალაქ") && !val.includes("სოფელ") && !val.includes("1") && !val.includes("2")) {
                return "⚠️ **გთხოვთ დააზუსტოთ:** ჩაწერთ 'ქალაქი' ან 'სოფელი'.";
            }
            return null;
        },
        action: (input) => {
            const val = input.toLowerCase();
            if (val.includes("სოფელ") || val.includes("2")) {
                deliveryCost = 8.00;
                collectedData.locationType = "სოფელი (8 ₾)";
            } else {
                deliveryCost = 3.00;
                collectedData.locationType = "ქალაქი (3 ₾)";
            }
            updateCartTotals();
        }
    },
    { 
        key: "cityAddress", 
        text: "გთხოვთ ჩამიწეროთ **ზუსტი მისამართი** (ქუჩა, შენობის/სახლის ნომერი, სოფლის დასახელება):",
        validate: (input) => {
            if (input.trim().length < 4) {
                return "⚠️ **შეცდომა:** მისამართი ძალიან მოკლეა! გთხოვთ მიუთითოთ სრული მისამართი შეკვეთის ზუსტად მოსატანად.";
            }
            return null;
        }
    },
    { key: "floorCode", text: "ხომ ვერ დააზუსტებთ **სართულს, ბინის ნომერს ან სადარბაზოს კოდს**?" },
    { key: "freshnessReq", text: "შეკვეთაში გვაქვს მალფუჭებადი/ახალი პროდუქტები. ხორცპროდუქტებსა და რძის ნაწარმზე ხომ არ გაქვთ ვარგისიანობის ვადის განსაკუთრებული მოთხოვნა?" },
    { key: "breadType", text: "პურ-ფუნთუშეულისა და საკონდიტრო ნაწარმის შემთხვევაში, რა სახეობის/ფაქტურის პროდუქტი გირჩევნიათ?" },
    { key: "allergyNotes", text: "ხომ არ აქვს ვინმეს **ალერგია** რომელიმე ინგრედიენტზე (მაგ. ლაქტოზა, გლუტენი, თხილეული)?" },
    { key: "replacementPolicy", text: "თუ რომელიმე კონკრეტული ბრენდის პროდუქტი საწყობში არ აღმოჩნდება, გსურთ თუ არა სხვა ექვივალენტური ბრენდით ჩანაცვლება?" },
    { key: "deliveryTime", text: "როდის გსურთ კურიერის მოსვლა? (გთხოვთ მიუთითოთ **სასურველი დროის ინტერვალი**):" },
    { key: "paymentMethod", text: "გადახდას როგორ გეგმავთ: **ნაღდი ანგარიშსწორებით** კურიერთან თუ **საბანკო გადარიცხვით**?" },
    { key: "changeRequirement", text: "თუ ნაღდი ანგარიშსწორებაა, დასჭირდება თუ არა კურიერს **ხურდის მოტანა** (რა თანხიდან)?" }
];

function handleUserResponse() {
    const inputEl = document.getElementById('ai-user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    // 1. Validation logic for current active step
    if (currentStep > 0 && currentStep <= aiQuestions.length) {
        const currentQ = aiQuestions[currentStep - 1];
        if (currentQ.validate) {
            const errorMsg = currentQ.validate(userText);
            if (errorMsg) {
                appendAIMessage(userText, 'user');
                inputEl.value = '';
                setTimeout(() => {
                    appendAIMessage(errorMsg, 'bot error');
                }, 400);
                return; // Stop here until corrected
            }
        }
    }

    // 2. Display user answer
    appendAIMessage(userText, 'user');
    inputEl.value = '';

    // Save Data
    if (currentStep === 0) {
        collectedData.fullName = userText;
    } else if (currentStep <= aiQuestions.length) {
        const prevQ = aiQuestions[currentStep - 1];
        
        let finalVal = userText;
        if (prevQ.format) finalVal = prevQ.format(userText);
        if (prevQ.action) prevQ.action(userText);

        collectedData[prevQ.key] = finalVal;
    }

    currentStep++;

    // 3. Next AI Step Response
    setTimeout(() => {
        if (currentStep <= aiQuestions.length) {
            // Persuasive physical store recommendation at step 5
            if (currentStep === 5) {
                appendAIMessage("💡 *შეხსენება:* ონლაინ შეკვეთის დეტალების დაზუსტება დროს მოითხოვს. თუ გეჩქარებათ, შეგიძლიათ პირდაპირ მობრძანდეთ ჩვენს მარკეტში **იაძის ქუჩა #2ი-ში**, სადაც პროდუქციას დაუყოვნებლივ მიიღებთ!\n\nთუმცა, თუ ონლაინ გირჩევნიათ, გავაგრძელოთ 👇", 'bot');
            }
            
            const nextQ = aiQuestions[currentStep - 1];
            appendAIMessage(nextQ.text, 'bot');
        } else {
            // All Questions Successfully Completed
            appendAIMessage("🎉 **ყველა მონაცემი ზუსტად შემოწმდა და მიღებულია!**\n\nქვემოთ გამოჩნდა ღილაკი. დააჭირეთ და შეკვეთა სრულად გაიგზავნება WhatsApp-ზე!", 'bot');
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
    let finalDelivery = subtotal >= 250 ? 0 : deliveryCost;
    const finalTotal = subtotal + finalDelivery;

    const fullMessage = 
`🛒 *ახალი შეკვეთა MINI MARKET-ში*
----------------------------------
👤 *მყიდველი:* ${collectedData.fullName}
🆔 *პირადი №:* ${collectedData.personalId}
📞 *ტელეფონი:* ${collectedData.phone}
🌐 *ზონა:* ${collectedData.locationType}
📍 *მისამართი:* ${collectedData.cityAddress}
🏢 *სართული/კოდი:* ${collectedData.floorCode}

📦 *პროდუქცია:*
${itemsText}

💰 *პროდუქცია:* ${subtotal.toFixed(2)} ₾
🚚 *მიწოდება:* ${finalDelivery.toFixed(2)} ₾
✅ *სულ ჯამი:* ${finalTotal.toFixed(2)} ₾

📋 *დამატებითი დეტალები:*
• ვარგისიანობის მოთხოვნა: ${collectedData.freshnessReq}
• პურის ტიპი: ${collectedData.breadType}
• ალერგიები: ${collectedData.allergyNotes}
• ჩანაცვლება: ${collectedData.replacementPolicy}
• სასურველი დრო: ${collectedData.deliveryTime}
• გადახდის მეთოდი: ${collectedData.paymentMethod}
• ხურდის საჭიროება: ${collectedData.changeRequirement}`;

    const encodedMsg = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
}
