let allProducts = [];
let cart = [];

let deliveryCost = 3.00;

// Web3Forms delivers this order straight to the shop's inbox in the background.
const WEB3FORMS_ACCESS_KEY = "5c6ec571-bc5b-4d67-b235-26c5655fb970";

// Delivery price within the city (edit this number to match your real cost, 3-5 GEL range).
const CITY_DELIVERY_PRICE = 5;

// Delivery price per village/community (temi) in Akhaltsikhe municipality.
// These are PLACEHOLDER numbers based only on the community list - EDIT them to your real
// per-village delivery cost (8-20 GEL range) before publishing.
const VILLAGE_DELIVERY_PRICES = {
    "აგარა": 9,
    "კლდე": 10,
    "ანდრიაწმინდა": 10,
    "აწყური": 10,
    "მინაძე": 11,
    "საძელი": 12,
    "ელიაწმინდა": 12,
    "პატარა პამაჯი": 13,
    "დიდი პამაჯი":12,
    "სვირი": 14,
    "სხვილისი": 15,
    "ურავლი": 16,
    "ფერსა": 18,
    "წყალთბილა": 19,
    "წყრუთი": 20,
    "ჭაჭარაქი":11,
    "ნაოხრები":20,
    "ხაკი":20,
    "ყულალისი":15,
    "საძელი":12
};

let collectedData = {
    fullName: "", personalId: "", mobile: "", zoneChoice: "", village: "", cityAddress: "",
    floorCode: "", freshnessReq: "", breadType: "", allergyNotes: "", replacementPolicy: "",
    deliveryTime: "", paymentMethod: "", changeRequirement: ""
};

let stepIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch JSON products
    fetch('products.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(err => {
            console.error("Error loading products:", err);
            document.getElementById('product-list').innerHTML = '<p style="color:red; grid-column:1/-1; text-align:center;">პროდუქტების ჩატვირთვა ვერ მოხერხდა.</p>';
        });

    // 2. Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(query)));
        });
    }

    // 3. Listeners
    document.getElementById('open-cart-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('copy-iban-btn').addEventListener('click', copyIBAN);
    document.getElementById('ai-send-btn').addEventListener('click', handleUserResponse);
    document.getElementById('ai-user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserResponse();
    });
    document.getElementById('submit-order-btn').addEventListener('click', sendFinalOrder);

    // 4. Keep the chat input visible above the mobile on-screen keyboard
    const chatInputEl = document.getElementById('ai-user-input');
    chatInputEl.addEventListener('focus', () => {
        setTimeout(() => {
            chatInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            const modal = document.getElementById('checkout-modal');
            if (modal.classList.contains('show') && document.activeElement === chatInputEl) {
                chatInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
});

function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding: 40px; color:#888;">პროდუქტი ვერ მოიძებნა.</p>';
        return;
    }

    products.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const safeName = item.name.replace(/'/g, "\\'");
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/180?text=Mini+Market'">
            </div>
            <div class="product-title">${item.name}</div>
            <div class="qty-stepper">
                <button type="button" class="qty-btn" onclick="adjustQty(${i}, -1)">-</button>
                <span class="qty-value" id="qty-${i}">1</span>
                <button type="button" class="qty-btn" onclick="adjustQty(${i}, 1)">+</button>
            </div>
            <div class="product-footer">
                <div class="product-price">${Number(item.price).toFixed(2)} ₾</div>
                <button type="button" class="add-to-cart-btn" onclick="addToCartWithQty(${i}, '${safeName}', ${item.price})">
                    <i class="fa-solid fa-cart-plus"></i> დამატება
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function adjustQty(i, delta) {
    const span = document.getElementById('qty-' + i);
    if (!span) return;
    let val = parseInt(span.innerText, 10) + delta;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    span.innerText = val;
}

function addToCartWithQty(i, name, price) {
    const span = document.getElementById('qty-' + i);
    const qtyToAdd = span ? parseInt(span.innerText, 10) : 1;
    addToCart(name, price, qtyToAdd);
    if (span) span.innerText = 1;
}

function addToCart(name, price, qty = 1) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name: name, price: Number(price), qty: qty });
    }
    updateCartUI();
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('cart-total-header').innerText = subtotal.toFixed(2);
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
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#888;">კალათა ცარიელია</p>';
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
        updateCartUI();
    }
}

function isWorkingHours() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 10 && hour < 18;
}

// ================= AI Modal Flow =================
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!");
        return;
    }

    deliveryCost = CITY_DELIVERY_PRICE;
    renderCartItems();
    updateCartTotals();

    const modal = document.getElementById('checkout-modal');
    modal.classList.add('show');

    document.getElementById('ai-messages-box').innerHTML = '';

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> შეკვეთის დადასტურება';

    // reset collected data / flow state for a fresh order
    collectedData = {
        fullName: "", personalId: "", mobile: "", zoneChoice: "", village: "", cityAddress: "",
        floorCode: "", freshnessReq: "", breadType: "", allergyNotes: "", replacementPolicy: "",
        deliveryTime: "", paymentMethod: "", changeRequirement: ""
    };
    stepIndex = -1;

    if (!isWorkingHours()) {
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        appendAIMessage("⛔ გამარჯობა! ამჟამად არასამუშაო საათებია (10:00 - 18:00).\n\nონლაინ შეკვეთების მიღება დროებით შეჩერებულია. გთხოვთ გვეწვიოთ მარკეტში: **ახალციხე, იაძის ქუჩა #2ი**!", 'bot');
        return;
    }

    stepIndex = findNextStepIndex(-1);
    renderStep(stepIndex);
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

// ---- step definitions ----
// kind: 'text' (typed answer with optional validate/format),
//       'choice' (tap one of a few buttons),
//       'select' (dropdown - used for the village list)
const steps = [
    {
        id: "fullName", kind: "text",
        prompt: "გამარჯობა! მე ვარ Mini Market-ის AI კონსულტანტი. 🛒\n\nსიამოვნებით დაგეხმარებით შეკვეთის გაფორმებაში. გთხოვთ მიუთითოთ თქვენი **სახელი და გვარი**:",
        validate: (input) => {
            if (input.trim().length < 2) {
                return "⚠️ **შეცდომა:** გთხოვთ მიუთითოთ სახელი და გვარი.";
            }
            return null;
        }
    },
    {
        id: "personalId", kind: "text",
        prompt: "გმადლობთ! ახლა გთხოვთ მიუთითოთ თქვენი **პირადი ნომერი** (ზუსტად 11 ციფრი):",
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
        id: "mobile", kind: "text",
        prompt: "შესანიშნავია. რა არის თქვენი **მობილურის ნომერი**? (მაგ: 599123456 - 9 ციფრი):",
        validate: (input) => {
            const clean = input.replace(/\D/g, '');
            const num = clean.startsWith('995') ? clean.slice(3) : clean;
            if (num.length !== 9) {
                return "⚠️ **შეცდომა:** ტელეფონის ნომერი არასწორია ან მოკლეა! გთხოვთ მიუთითოთ ზუსტად 9 ციფრიანი ნომერი (მაგ: 599123456).";
            }
            return null;
        },
        format: (input) => {
            const clean = input.replace(/\D/g, '');
            return clean.startsWith('995') ? clean.slice(3) : clean;
        }
    },
    {
        id: "zoneChoice", kind: "choice",
        prompt: "გთხოვთ აირჩიოთ მიწოდების ზონა:",
        options: ["ქალაქი", "სოფელი"],
        onAnswer: (value) => {
            collectedData.zoneChoice = value;
            if (value === "ქალაქი") {
                deliveryCost = CITY_DELIVERY_PRICE;
                updateCartTotals();
            }
            // village price gets set at the next step
        }
    },
    {
        id: "village", kind: "select",
        prompt: "აირჩიეთ თქვენი სოფელი/თემი - მიწოდების ფასი ავტომატურად დაითვლება:",
        showIf: () => collectedData.zoneChoice === "სოფელი",
        optionsMap: VILLAGE_DELIVERY_PRICES,
        onAnswer: (value) => {
            collectedData.village = value;
            deliveryCost = VILLAGE_DELIVERY_PRICES[value] || 10;
            updateCartTotals();
        }
    },
    {
        id: "cityAddress", kind: "text",
        prompt: "გთხოვთ ჩამიწეროთ **ზუსტი მისამართი** (ქუჩა, შენობის/სახლის ნომერი):",
        showIf: () => collectedData.zoneChoice === "ქალაქი",
        validate: (input) => {
            if (input.trim().length < 4) {
                return "⚠️ **შეცდომა:** მისამართი ძალიან მოკლეა! გთხოვთ მიუთითოთ სრული მისამართი შეკვეთის ზუსტად მოსატანად.";
            }
            return null;
        }
    },
    {
        id: "floorCode", kind: "text",
        prompt: "ხომ ვერ დააზუსტებთ **სართულს, ბინის ნომერს, სადარბაზოს კოდს ან სახლის ნიშანს**?"
    },
    {
        id: "freshnessReq", kind: "text",
        remindBefore: true,
        prompt: "შეკვეთაში გვაქვს მალფუჭებადი პროდუქტები. ხორცპროდუქტებსა და რძის ნაწარმზე ხომ არ გაქვთ ვარგისიანობის ვადის განსაკუთრებული მოთხოვნა?"
    },
    { id: "breadType", kind: "text", prompt: "პურ-ფუნთუშეულისა და საკონდიტრო ნაწარმის შემთხვევაში, რა სახეობის/ფაქტურის პროდუქტი გირჩევნიათ?" },
    { id: "allergyNotes", kind: "text", prompt: "ხომ არ აქვს ვინმეს **ალერგია** რომელიმე ინგრედიენტზე (მაგ. ლაქტოზა, გლუტენი, თხილეული)?" },
    { id: "replacementPolicy", kind: "text", prompt: "თუ რომელიმე კონკრეტული ბრენდი საწყობში არ აღმოჩნდება, გსურთ თუ არა სხვა ექვივალენტური ბრენდით ჩანაცვლება?" },
    { id: "deliveryTime", kind: "text", prompt: "როდის გსურთ კურიერის მოსვლა? (გთხოვთ მიუთითოთ **სასურველი დროის ინტერვალი**):" },
    { id: "paymentMethod", kind: "text", prompt: "გადახდას როგორ გეგმავთ: **ნაღდი ანგარიშსწორებით** კურიერთან თუ **საბანკო გადარიცხვით**?" },
    { id: "changeRequirement", kind: "text", prompt: "თუ ნაღდი ანგარიშსწორებაა, დასჭირდება თუ არა კურიერს **ხურდის მოტანა** (რა თანხიდან)?" }
];

function findNextStepIndex(fromIndex) {
    let i = fromIndex + 1;
    while (i < steps.length) {
        const s = steps[i];
        if (!s.showIf || s.showIf()) return i;
        i++;
    }
    return steps.length;
}

function renderStep(idx) {
    if (idx >= steps.length) {
        finishFlow();
        return;
    }
    const step = steps[idx];

    if (step.remindBefore) {
        appendAIMessage("💡 *შეხსენება:* თუ გეჩქარებათ, შეგიძლიათ პირდაპირ მობრძანდეთ ჩვენს მინი მარკეტში **იაძის ქუჩა #2ი-ში**!\n\nთუმცა, თუ ონლაინ გირჩევნიათ, გავაგრძელოთ 👇", 'bot');
    }

    appendAIMessage(step.prompt, 'bot');

    if (step.kind === "text") {
        document.getElementById('ai-input-wrapper').classList.remove('hidden');
        document.getElementById('ai-user-input').focus();
    } else if (step.kind === "choice") {
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        renderChoiceButtons(step);
    } else if (step.kind === "select") {
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        renderVillageSelect(step);
    }
}

function advanceFlow() {
    stepIndex = findNextStepIndex(stepIndex);
    setTimeout(() => renderStep(stepIndex), 450);
}

function finishFlow() {
    appendAIMessage("🎉 **ყველა მონაცემი ზუსტად შემოწმდა და მიღებულია!**\n\nქვემოთ გამოჩნდა ღილაკი — დააჭირეთ და შეკვეთა დასრულდება!", 'bot');
    document.getElementById('ai-input-wrapper').classList.add('hidden');
    document.getElementById('submit-order-btn').classList.remove('hidden');
}

function renderChoiceButtons(step) {
    const box = document.getElementById('ai-messages-box');
    const wrap = document.createElement('div');
    wrap.className = 'chat-choice-row';
    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-choice-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => {
            wrap.remove();
            appendAIMessage(opt, 'user');
            if (step.onAnswer) step.onAnswer(opt);
            advanceFlow();
        });
        wrap.appendChild(btn);
    });
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function renderVillageSelect(step) {
    const box = document.getElementById('ai-messages-box');
    const wrap = document.createElement('div');
    wrap.className = 'chat-select-row';

    const select = document.createElement('select');
    select.className = 'chat-select';
    Object.keys(step.optionsMap).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = `${name} \u2014 ${step.optionsMap[name]} \u20be`;
        select.appendChild(opt);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'chat-select-confirm';
    confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    confirmBtn.addEventListener('click', () => {
        const value = select.value;
        wrap.remove();
        appendAIMessage(`${value} (${step.optionsMap[value]} ₾)`, 'user');
        if (step.onAnswer) step.onAnswer(value);
        advanceFlow();
    });

    wrap.appendChild(select);
    wrap.appendChild(confirmBtn);
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function handleUserResponse() {
    const inputEl = document.getElementById('ai-user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    const step = steps[stepIndex];
    if (!step || step.kind !== "text") return;

    if (step.validate) {
        const errorMsg = step.validate(userText);
        if (errorMsg) {
            appendAIMessage(userText, 'user');
            inputEl.value = '';
            setTimeout(() => {
                appendAIMessage(errorMsg, 'bot error');
            }, 300);
            return;
        }
    }

    appendAIMessage(userText, 'user');
    inputEl.value = '';

    let finalVal = userText;
    if (step.format) finalVal = step.format(userText);
    collectedData[step.id] = finalVal;
    if (step.onAnswer) step.onAnswer(finalVal);

    advanceFlow();
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

function buildOrderMessage() {
    const itemsText = cart.map(i => `• ${i.name} - ${i.qty}ც (${(i.price * i.qty).toFixed(2)}₾)`).join('\n');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let finalDelivery = subtotal >= 250 ? 0 : deliveryCost;
    const finalTotal = subtotal + finalDelivery;

    const zoneDisplay = collectedData.zoneChoice === "სოფელი"
        ? `სოფელი/თემი: ${collectedData.village}`
        : "ქალაქი";

    const addressDisplay = collectedData.zoneChoice === "სოფელი"
        ? `${collectedData.village} (იხ. ზონა)`
        : collectedData.cityAddress;

    return (
`🛒 ახალი შეკვეთა MINI MARKET-ში
----------------------------------
👤 მყიდველი: ${collectedData.fullName}
🆔 პირადი №: ${collectedData.personalId}
📞 ტელეფონი: +995${collectedData.mobile}
🌐 ზონა: ${zoneDisplay}
📍 მისამართი: ${addressDisplay}
🏢 სართული/კოდი/ნიშანი: ${collectedData.floorCode}

📦 პროდუქცია:
${itemsText}

💰 პროდუქცია: ${subtotal.toFixed(2)} ₾
🚚 მიწოდება: ${finalDelivery.toFixed(2)} ₾
✅ სულ ჯამი: ${finalTotal.toFixed(2)} ₾

📋 დამატებითი დეტალები:
• ვარგისიანობის მოთხოვნა: ${collectedData.freshnessReq}
• პურის ტიპი: ${collectedData.breadType}
• ალერგიები: ${collectedData.allergyNotes}
• ჩანაცვლება: ${collectedData.replacementPolicy}
• სასურველი დრო: ${collectedData.deliveryTime}
• გადახდის მეთოდი: ${collectedData.paymentMethod}
• ხურდის საჭიროება: ${collectedData.changeRequirement}`
    );
}

// Sends the finished order to the shop's inbox in the background via Web3Forms.
// The customer never sees where it goes — they only see the confirmation message below.
async function submitOrderToEmail(message) {
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: "ახალი შეკვეთა — Mini Market",
                from_name: collectedData.fullName || "Mini Market საიტი",
                message: message
            })
        });
        const result = await response.json();
        console.log("Web3Forms response:", response.status, result);
        return !!result.success;
    } catch (err) {
        console.error("Order submit error:", err);
        return false;
    }
}

async function sendFinalOrder() {
    const btn = document.getElementById('submit-order-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> იგზავნება...';

    const message = buildOrderMessage();
    const success = await submitOrderToEmail(message);

    if (success) {
        appendAIMessage("✅ თქვენი შეკვეთა წარმატებით მიღებულია! ჩვენი წარმომადგენელი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.\n\nმადლობა რომ გვირჩევთ! 🙏", 'bot');
        btn.classList.add('hidden');
    } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> სცადეთ თავიდან';
        appendAIMessage("⚠️ შეკვეთის გაგზავნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა ან დაგვირეკოთ ტელეფონით.", 'bot error');
    }
}
