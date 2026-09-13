let allProducts = [];
let cart = [];

let currentStep = 0;
let deliveryCost = 3.00;

// Web3Forms delivers this order straight to the shop's inbox in the background.
const WEB3FORMS_ACCESS_KEY = "b4fcd015-d5a8-4a2a-8e1a-39088c68357e";

let collectedData = {
    fullName: "", personalId: "", phone: "", locationType: "", cityAddress: "", floorCode: "",
    freshnessReq: "", breadType: "", allergyNotes: "", replacementPolicy: "", deliveryTime: "", paymentMethod: "", changeRequirement: ""
};

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
});

function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding: 40px; color:#888;">პროდუქტი ვერ მოიძებნა.</p>';
        return;
    }

    products.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/180?text=Mini+Market'">
            </div>
            <div class="product-title">${item.name}</div>
            <div class="product-footer">
                <div class="product-price">${Number(item.price).toFixed(2)} ₾</div>
                <button type="button" class="add-to-cart-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price})">
                    <i class="fa-solid fa-cart-plus"></i> დამატება
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: Number(price), qty: 1 });
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

    deliveryCost = 3.00;
    renderCartItems();
    updateCartTotals();

    const modal = document.getElementById('checkout-modal');
    modal.classList.add('show');

    currentStep = 0;
    document.getElementById('ai-messages-box').innerHTML = '';

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> შეკვეთის დადასტურება';

    document.getElementById('ai-input-wrapper').classList.remove('hidden');

    if (!isWorkingHours()) {
        appendAIMessage("⛔ გამარჯობა! ამჟამად არასამუშაო საათებია (10:00 - 18:00).\n\nონლაინ შეკვეთების მიღება დროებით შეჩერებულია. გთხოვთ გვეწვიოთ მარკეტში: **ახალციხე, იაძის ქუჩა #2ი**!", 'bot');
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        return;
    }

    appendAIMessage("გამარჯობა! მე ვარ Mini Market-ის AI კონსულტანტი. 🛒\n\nსიამოვნებით დაგეხმარებით შეკვეთის გაფორმებაში. გთხოვთ მიუთითოთ თქვენი **სახელი და გვარი**:", 'bot');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

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
        key: "phone",
        text: "გთხოვთ აირჩიოთ მიწოდების ზონა:\n1️⃣ **ქალაქში (3₾)**\n2️⃣ **სოფელში/გარეუბანში (8₾)**\n\n(ჩაწერთ: ქალაქი ან სოფელი):",
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
    { key: "freshnessReq", text: "შეკვეთაში გვაქვს მალფუჭებადი პროდუქტები. ხორცპროდუქტებსა და რძის ნაწარმზე ხომ არ გაქვთ ვარგისიანობის ვადის განსაკუთრებული მოთხოვნა?" },
    { key: "breadType", text: "პურ-ფუნთუშეულისა და საკონდიტრო ნაწარმის შემთხვევაში, რა სახეობის/ფაქტურის პროდუქტი გირჩევნიათ?" },
    { key: "allergyNotes", text: "ხომ არ აქვს ვინმეს **ალერგია** რომელიმე ინგრედიენტზე (მაგ. ლაქტოზა, გლუტენი, თხილეული)?" },
    { key: "replacementPolicy", text: "თუ რომელიმე კონკრეტული ბრენდი საწყობში არ აღმოჩნდება, გსურთ თუ არა სხვა ექვივალენტური ბრენდით ჩანაცვლება?" },
    { key: "deliveryTime", text: "როდის გსურთ კურიერის მოსვლა? (გთხოვთ მიუთითოთ **სასურველი დროის ინტერვალი**):" },
    { key: "paymentMethod", text: "გადახდას როგორ გეგმავთ: **ნაღდი ანგარიშსწორებით** კურიერთან თუ **საბანკო გადარიცხვით**?" },
    { key: "changeRequirement", text: "თუ ნაღდი ანგარიშსწორებაა, დასჭირდება თუ არა კურიერს **ხურდის მოტანა** (რა თანხიდან)?" }
];

function handleUserResponse() {
    const inputEl = document.getElementById('ai-user-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    if (currentStep > 0 && currentStep <= aiQuestions.length) {
        const currentQ = aiQuestions[currentStep - 1];
        if (currentQ.validate) {
            const errorMsg = currentQ.validate(userText);
            if (errorMsg) {
                appendAIMessage(userText, 'user');
                inputEl.value = '';
                setTimeout(() => {
                    appendAIMessage(errorMsg, 'bot error');
                }, 300);
                return;
            }
        }
    }

    appendAIMessage(userText, 'user');
    inputEl.value = '';

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

    setTimeout(() => {
        if (currentStep <= aiQuestions.length) {
            if (currentStep === 5) {
                appendAIMessage("💡 *შეხსენება:* თუ გეჩქარებათ, შეგიძლიათ პირდაპირ მობრძანდეთ ჩვენს მინი მარკეტში **იაძის ქუჩა #2ი-ში**!\n\nთუმცა, თუ ონლაინ გირჩევნიათ, გავაგრძელოთ 👇", 'bot');
            }
            const nextQ = aiQuestions[currentStep - 1];
            appendAIMessage(nextQ.text, 'bot');
        } else {
            appendAIMessage("🎉 **ყველა მონაცემი ზუსტად შემოწმდა და მიღებულია!**\n\nქვემოთ გამოჩნდა ღილაკი — დააჭირეთ და შეკვეთა დასრულდება!", 'bot');
            document.getElementById('ai-input-wrapper').classList.add('hidden');
            document.getElementById('submit-order-btn').classList.remove('hidden');
        }
    }, 500);
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

    return (
`🛒 ახალი შეკვეთა MINI MARKET-ში
----------------------------------
👤 მყიდველი: ${collectedData.fullName}
🆔 პირადი №: ${collectedData.personalId}
📞 ტელეფონი: +995${collectedData.phone}
🌐 ზონა: ${collectedData.locationType}
📍 მისამართი: ${collectedData.cityAddress}
🏢 სართული/კოდი: ${collectedData.floorCode}

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

