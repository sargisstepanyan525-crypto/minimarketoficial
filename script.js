let allProducts = [];
let cart = [];

let deliveryCost = 4.00;

// Web3Forms delivers this order straight to the shop's inbox in the background.
const WEB3FORMS_ACCESS_KEY = "5c6ec571-bc5b-4d67-b235-26c5655fb970";

// Delivery price within the city (edit this number to match your real cost, 3-5 GEL range).
const CITY_DELIVERY_PRICE = 5;

// Delivery price per village/community (temi) in Akhaltsikhe municipality.
// These are PLACEHOLDER numbers based only on the community list - EDIT them to your real
// per-village delivery cost (8-20 GEL range) before publishing. Village names are kept in
// Georgian in every language since they are official place names.
const VILLAGE_DELIVERY_PRICES = {
    "აგარა": 8,
    "კლდე": 9,
    "ანდრიაწმინდა": 10,
    "აწყური": 10,
    "მინაძე": 11,
    "საძელი": 12,
    "ელიაწმინდა": 12,
    "პამაჯი": 13,
    "სვირი": 14,
    "სხვილისი": 15,
    "ურავლი": 16,
    "ფერსა": 18,
    "წყალთბილა": 19,
    "წყრუთი": 20
};

// Time windows offered when an order is placed outside working hours - delivery
// for those orders happens the next day in one of these slots.
const NEXT_DAY_SLOTS = ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"];

let collectedData = {
    fullName: "", personalId: "", mobile: "", zoneChoice: "", village: "", cityAddress: "",
    floorCode: "", freshnessReq: "", breadType: "", allergyNotes: "", replacementPolicy: "",
    deliveryTime: "", paymentMethod: "", changeRequirement: ""
};

let stepIndex = -1;
let activeCategory = 'all';

// Lightweight keyword-based categorizer - the catalog has no category field, so a
// product's name decides its bucket. Order matters: first matching bucket wins.
const CATEGORY_RULES = [
    { code: 'drinks', keys: ['წყალი', 'კოკ-კოლა', 'ფანტა', 'არაყი', 'ლუდი', 'წვენი', 'ენერგეტიკული', 'ყავა'] },
    { code: 'meat_dairy', keys: ['ხორც', 'ქათმის', 'ღორის', 'სუჯუხი', 'ბასტურმა', 'ხიზილალა', 'რძის', 'ერბო', 'სპრედი'] },
    { code: 'sweets', keys: ['შოკოლად', 'ვაფლი', 'ჩირის', 'მზესუმზირა', 'ჩიფსი'] },
    { code: 'spices', keys: ['სუნელი', 'ვანილი', 'ნიორი', 'კურკუმა', 'როზმარინი', 'რეჰანი', 'ბარბარისი'] },
    { code: 'household', keys: ['ტუალეტ', 'სარეცხის', 'საპონი', 'ასანთი', 'ხელთათმან', 'ხელსახოც', 'სალფეთქ', 'ტილო', 'ნაჭერი', 'საწმენდ'] }
];

function categorize(name) {
    const n = name.toLowerCase();
    for (const rule of CATEGORY_RULES) {
        if (rule.keys.some(k => n.includes(k))) return rule.code;
    }
    return 'pantry';
}

function applyProductFilters() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sortMode = sortSelect ? sortSelect.value : 'default';

    let list = allProducts;
    if (activeCategory !== 'all') {
        list = list.filter(p => categorize(p.name) === activeCategory);
    }
    if (query) {
        list = list.filter(p => p.name.toLowerCase().includes(query));
    }

    list = list.slice();
    if (sortMode === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name, 'ka'));
    } else if (sortMode === 'price_low') {
        list.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price_high') {
        list.sort((a, b) => b.price - a.price);
    }

    renderProducts(list);
}

document.addEventListener("DOMContentLoaded", () => {
    // 0. Restore any cart saved from a previous visit
    loadCartFromStorage();
    updateCartUI();

    // 1. Fetch JSON products
    fetch('products.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(err => {
            console.error("Error loading products:", err);
            document.getElementById('product-list').innerHTML = `<p style="color:red; grid-column:1/-1; text-align:center;">${t('products_load_error')}</p>`;
        });

    // 2. Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyProductFilters);
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyProductFilters);
    }

    // 2b. Category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.getAttribute('data-category');
            applyProductFilters();
        });
    });

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

    // 5. Playful logo bounce on tap/click
    const logoIcon = document.querySelector('.brand-logo .logo-icon');
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo && logoIcon) {
        brandLogo.addEventListener('click', () => {
            logoIcon.classList.remove('logo-bump');
            void logoIcon.offsetWidth;
            logoIcon.classList.add('logo-bump');
        });
    }

    // 6. Site-wide Smart AI Assistant (FAQ chat, available on every page load)
    initSmartAssistant();

    // 7. Header gains a touch more depth once the page scrolls
    const mainHeader = document.querySelector('.main-header');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (mainHeader || backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (mainHeader) mainHeader.classList.toggle('scrolled', window.scrollY > 12);
            if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 8. Material-style ripple feedback on every primary button
    attachRippleEffect('.add-to-cart-btn, .cart-btn, .confirm-order-btn, .chat-choice-btn, .qty-btn, .lang-btn, .faq-fab, .send-btn, .chat-select-confirm');
});

function attachRippleEffect(selector) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest(selector);
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    });
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding: 40px; color:#888;">${t('products_not_found')}</p>`;
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
                <button type="button" class="add-to-cart-btn" onclick="addToCartWithQty(this, ${i}, '${safeName}', ${item.price})">
                    <i class="fa-solid fa-cart-plus"></i> ${t('add_to_cart_btn')}
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

function addToCartWithQty(btnEl, i, name, price) {
    const span = document.getElementById('qty-' + i);
    const qtyToAdd = span ? parseInt(span.innerText, 10) : 1;
    addToCart(name, price, qtyToAdd);
    if (span) span.innerText = 1;

    if (btnEl) {
        btnEl.classList.remove('added-flash');
        void btnEl.offsetWidth; // restart animation if clicked again quickly
        btnEl.classList.add('added-flash');
        setTimeout(() => btnEl.classList.remove('added-flash'), 500);
    }

    showToast(`${name} \u2014 ${t('toast_added')}`, 'success');
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

    const badge = document.getElementById('cart-count');
    badge.innerText = totalQty;
    document.getElementById('cart-total-header').innerText = subtotal.toFixed(2);

    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');

    saveCartToStorage();
}

// Cart persistence - so a page refresh or a returning visitor doesn't lose their basket.
function saveCartToStorage() {
    try {
        localStorage.setItem('mm_cart', JSON.stringify(cart));
    } catch (e) { /* storage unavailable - fail silently, cart still works for this session */ }
}

function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('mm_cart');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) cart = parsed;
        }
    } catch (e) { /* ignore corrupt/blocked storage */ }
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

    const hint = document.getElementById('free-delivery-hint');
    if (hint) {
        if (subtotal <= 0) {
            hint.classList.add('hidden');
            hint.classList.remove('reached');
            hint.textContent = '';
        } else if (subtotal >= 250) {
            hint.classList.remove('hidden');
            hint.classList.add('reached');
            hint.textContent = t('free_delivery_reached');
        } else {
            hint.classList.remove('hidden');
            hint.classList.remove('reached');
            hint.textContent = t('free_delivery_progress').replace('{amount}', (250 - subtotal).toFixed(2));
        }
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px; color:#888;">${t('cart_empty')}</p>`;
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
        showToast(t('cart_empty_alert'), 'warn');
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
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${t('submit_btn')}`;

    const progressBar = document.getElementById('checkout-progress-bar');
    if (progressBar) progressBar.style.width = '0%';

    // reset collected data / flow state for a fresh order
    collectedData = {
        fullName: "", personalId: "", mobile: "", zoneChoice: "", village: "", cityAddress: "",
        floorCode: "", freshnessReq: "", breadType: "", allergyNotes: "", replacementPolicy: "",
        deliveryTime: "", paymentMethod: "", changeRequirement: ""
    };
    stepIndex = -1;

    if (!isWorkingHours()) {
        appendAIMessage(t('outside_hours_notice'), 'bot');
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
// promptKey / errorKey reference the translations dictionary so the flow follows
// whichever language the customer picked with the GE/EN/RU/AM switcher.
const steps = [
    {
        id: "fullName", kind: "text",
        promptKey: "greet"
    },
    {
        id: "personalId", kind: "text",
        promptKey: "ask_personal_id",
        validate: (input) => {
            const clean = input.replace(/\D/g, '');
            if (clean.length !== 11) return t('err_personal_id');
            return null;
        },
        format: (input) => input.replace(/\D/g, '')
    },
    {
        id: "mobile", kind: "text",
        promptKey: "ask_mobile",
        validate: (input) => {
            const clean = input.replace(/\D/g, '');
            const num = clean.startsWith('995') ? clean.slice(3) : clean;
            if (num.length !== 9) return t('err_mobile');
            return null;
        },
        format: (input) => {
            const clean = input.replace(/\D/g, '');
            return clean.startsWith('995') ? clean.slice(3) : clean;
        }
    },
    {
        id: "zoneChoice", kind: "choice",
        promptKey: "ask_zone",
        optionCodes: ["city", "village"],
        onAnswer: (code) => {
            collectedData.zoneChoice = code;
            if (code === "city") {
                deliveryCost = CITY_DELIVERY_PRICE;
                updateCartTotals();
            }
            // village price gets set at the next step
        }
    },
    {
        id: "village", kind: "select",
        promptKey: "ask_village",
        showIf: () => collectedData.zoneChoice === "village",
        options: Object.keys(VILLAGE_DELIVERY_PRICES).map(name => ({
            value: name,
            label: `${name} \u2014 ${VILLAGE_DELIVERY_PRICES[name]} \u20be`
        })),
        onAnswer: (value) => {
            collectedData.village = value;
            deliveryCost = VILLAGE_DELIVERY_PRICES[value] || 10;
            updateCartTotals();
        }
    },
    {
        id: "cityAddress", kind: "text",
        promptKey: "ask_city_address",
        showIf: () => collectedData.zoneChoice === "city",
        validate: (input) => {
            if (input.trim().length < 4) return t('err_address_short');
            return null;
        }
    },
    { id: "floorCode", kind: "text", promptKey: "ask_floor_code" },
    { id: "freshnessReq", kind: "text", promptKey: "ask_freshness", remindBefore: true },
    { id: "breadType", kind: "text", promptKey: "ask_bread" },
    { id: "allergyNotes", kind: "text", promptKey: "ask_allergy" },
    { id: "replacementPolicy", kind: "text", promptKey: "ask_replacement" },
    { id: "deliveryTime", kind: "text", promptKey: "ask_delivery_time", showIf: () => isWorkingHours() },
    {
        id: "deliveryTimeSlot", kind: "select",
        promptKey: "ask_delivery_time_next_day",
        showIf: () => !isWorkingHours(),
        options: NEXT_DAY_SLOTS.map(slot => ({ value: slot, label: slot })),
        onAnswer: (value) => { collectedData.deliveryTime = value; }
    },
    { id: "paymentMethod", kind: "text", promptKey: "ask_payment" },
    { id: "changeRequirement", kind: "text", promptKey: "ask_change" }
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

function updateCheckoutProgress(idx) {
    const bar = document.getElementById('checkout-progress-bar');
    if (!bar) return;
    const visible = [];
    steps.forEach((s, i) => { if (!s.showIf || s.showIf()) visible.push(i); });
    const position = visible.indexOf(idx);
    const total = visible.length;
    const pct = total > 0 ? Math.min(100, Math.round(((position + 1) / total) * 100)) : 0;
    bar.style.width = pct + '%';
}

function renderStep(idx) {
    if (idx >= steps.length) {
        updateCheckoutProgress(steps.length - 1);
        const bar = document.getElementById('checkout-progress-bar');
        if (bar) bar.style.width = '100%';
        finishFlow();
        return;
    }
    const step = steps[idx];
    updateCheckoutProgress(idx);

    if (step.remindBefore) {
        appendAIMessage(t('remind_visit'), 'bot');
    }

    appendAIMessage(t(step.promptKey), 'bot');

    if (step.kind === "text") {
        document.getElementById('ai-input-wrapper').classList.remove('hidden');
        document.getElementById('ai-user-input').focus();
    } else if (step.kind === "choice") {
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        renderChoiceButtons(step);
    } else if (step.kind === "select") {
        document.getElementById('ai-input-wrapper').classList.add('hidden');
        renderSelectStep(step);
    }
}

function advanceFlow() {
    stepIndex = findNextStepIndex(stepIndex);
    setTimeout(() => renderStep(stepIndex), 450);
}

function finishFlow() {
    appendAIMessage(buildRecapMessage(), 'bot');
    document.getElementById('ai-input-wrapper').classList.add('hidden');
    document.getElementById('submit-order-btn').classList.remove('hidden');
}

function buildRecapMessage() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalDelivery = subtotal >= 250 ? 0 : deliveryCost;
    const total = subtotal + finalDelivery;
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const zoneText = collectedData.zoneChoice === "village" ? collectedData.village : t('zone_city');

    return t('recap_intro')
        .replace('{name}', collectedData.fullName || '')
        .replace('{count}', itemCount)
        .replace('{zone}', zoneText)
        .replace('{total}', total.toFixed(2));
}

function renderChoiceButtons(step) {
    const box = document.getElementById('ai-messages-box');
    const wrap = document.createElement('div');
    wrap.className = 'chat-choice-row';
    step.optionCodes.forEach(code => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-choice-btn';
        btn.innerText = t('zone_' + code);
        btn.addEventListener('click', () => {
            wrap.remove();
            appendAIMessage(t('zone_' + code), 'user');
            if (step.onAnswer) step.onAnswer(code);
            advanceFlow();
        });
        wrap.appendChild(btn);
    });
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function renderSelectStep(step) {
    const box = document.getElementById('ai-messages-box');
    const wrap = document.createElement('div');
    wrap.className = 'chat-select-row';

    const select = document.createElement('select');
    select.className = 'chat-select';
    step.options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.innerText = opt.label;
        select.appendChild(optionEl);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'chat-select-confirm';
    confirmBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    confirmBtn.addEventListener('click', () => {
        const value = select.value;
        const chosen = step.options.find(o => o.value === value);
        wrap.remove();
        appendAIMessage(chosen ? chosen.label : value, 'user');
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
        showToast(t('iban_copied_alert'), 'success');
    });
}

// Elegant toast notification - replaces native alert() popups.
function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) { console.log(message); return; }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type || 'info'}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'warn' ? 'fa-triangle-exclamation' : 'fa-circle-info');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// The order message emailed to the shop always stays in Georgian - that's for the
// shop owner reading it, regardless of which language the customer used on the site.
function buildOrderMessage() {
    const itemsText = cart.map(i => `• ${i.name} - ${i.qty}ც (${(i.price * i.qty).toFixed(2)}₾)`).join('\n');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let finalDelivery = subtotal >= 250 ? 0 : deliveryCost;
    const finalTotal = subtotal + finalDelivery;

    const zoneDisplay = collectedData.zoneChoice === "village"
        ? `სოფელი/თემი: ${collectedData.village}`
        : "ქალაქი";

    const addressDisplay = collectedData.zoneChoice === "village"
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
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${t('submit_btn_sending')}`;

    const message = buildOrderMessage();
    const success = await submitOrderToEmail(message);

    if (success) {
        appendAIMessage(t('success_msg'), 'bot');
        btn.classList.add('hidden');
    } else {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> ${t('submit_btn_retry')}`;
        appendAIMessage(t('error_send_msg'), 'bot error');
    }
}

// ================= Site-wide Smart AI Assistant (FAQ + product search) =================
// This runs entirely client-side (keyword/intent matching + a live search over
// products.json) - it does not call any external AI API, so it works instantly
// with no extra setup or API keys. It can be swapped later for a real LLM-backed
// assistant if a backend proxy is added to keep an API key private.

let faqGreeted = false;

function initSmartAssistant() {
    const fab = document.getElementById('faq-fab');
    const panel = document.getElementById('faq-panel');
    const closeBtn = document.getElementById('faq-close-btn');
    const input = document.getElementById('faq-input');
    const sendBtn = document.getElementById('faq-send-btn');

    if (!fab || !panel) return;

    fab.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('open');
        fab.classList.toggle('open', isOpen);
        const icon = fab.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-sparkles';
        }
        if (isOpen) {
            if (!faqGreeted) {
                faqGreeted = true;
                faqAppend(t('faq_greeting'), 'bot');
                faqRenderQuickReplies();
            }
            setTimeout(() => input && input.focus(), 200);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('open');
            fab.classList.remove('open');
        });
    }

    function send() {
        const text = input.value.trim();
        if (!text) return;
        faqAppend(text, 'user');
        input.value = '';
        faqTypingThenReply(text);
    }

    if (sendBtn) sendBtn.addEventListener('click', send);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') send();
        });
        input.addEventListener('focus', () => {
            setTimeout(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        });
    }
}

const FAQ_QUICK_REPLIES = [
    { labelKey: 'faq_quick_hours', replyKey: 'faq_ans_hours' },
    { labelKey: 'faq_quick_delivery', replyKey: 'faq_ans_delivery' },
    { labelKey: 'faq_quick_payment', replyKey: 'faq_ans_payment' },
    { labelKey: 'faq_quick_order', replyKey: 'faq_ans_how_to_order' }
];

function faqRenderQuickReplies() {
    const box = document.getElementById('faq-messages');
    if (!box) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-choice-row';
    FAQ_QUICK_REPLIES.forEach(qr => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-choice-btn';
        btn.innerText = t(qr.labelKey);
        btn.addEventListener('click', () => {
            wrap.remove();
            faqAppend(t(qr.labelKey), 'user');
            const typing = document.createElement('div');
            typing.className = 'chat-bubble bot typing-bubble';
            typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            box.appendChild(typing);
            box.scrollTop = box.scrollHeight;
            setTimeout(() => {
                typing.remove();
                faqAppend(t(qr.replyKey), 'bot');
            }, 500 + Math.random() * 350);
        });
        wrap.appendChild(btn);
    });
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function faqAppend(text, sender) {
    const box = document.getElementById('faq-messages');
    if (!box) return;
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function faqTypingThenReply(userText) {
    const box = document.getElementById('faq-messages');
    if (!box) return;
    const typing = document.createElement('div');
    typing.className = 'chat-bubble bot typing-bubble';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        typing.remove();
        faqAppend(getSmartReply(userText), 'bot');
    }, 550 + Math.random() * 450);
}

// Keyword lists cover all 4 site languages at once, so the assistant recognizes
// the question regardless of which language the visitor is typing in.
// Order matters: more specific intents are checked before broader ones.
const FAQ_INTENTS = [
    { keys: ['გამარჯობ', 'სალამ', 'hello', 'hi ', 'hey', 'привет', 'здравств', 'բարև', 'ողջույն'], replyKey: 'faq_ans_greeting' },
    { keys: ['მადლობ', 'გმადლობთ', 'thank', 'спасибо', 'благодар', 'շնորհակալ'], replyKey: 'faq_ans_thanks' },
    { keys: ['რა გაქვთ', 'რა პროდუქტ', 'ასორტიმენტ', 'კატალოგ', 'what do you have', 'what do you sell', 'catalog', 'что у вас', 'ассортимент', 'ինչ ունեք', 'կատալոգ'], replyKey: 'faq_ans_catalog' },
    { keys: ['250', 'უფასო', 'free', 'бесплат', 'անվճար'], replyKey: 'faq_ans_free_delivery' },
    { keys: ['სოფ', 'ვილიჯ', 'village', 'дерев', 'сел', 'գյուղ', 'համայնք'], replyKey: 'faq_ans_villages' },
    { keys: ['საათ', 'ღიაა', 'მუშაობ', 'hour', 'work', 'open', 'час', 'работа', 'ժամ', 'աշխատ', 'բաց'], replyKey: 'faq_ans_hours' },
    { keys: ['მიწოდებ', 'მიტან', 'куриер', 'достав', 'delivery', 'shipping', 'առաք'], replyKey: 'faq_ans_delivery' },
    { keys: ['გადახდ', 'ნაღდ', 'оплат', 'payment', 'pay', 'cash', 'վճար'], replyKey: 'faq_ans_payment' },
    { keys: ['ტელეფონ', 'დარეკ', 'მისამართ', 'contact', 'phone', 'address', 'телефон', 'адрес', 'контакт', 'հեռախոս', 'հասցե'], replyKey: 'faq_ans_contact' },
    { keys: ['ვინ ხარ', 'შენ რა ხარ', 'who are you', 'what are you', 'кто ты', 'что ты', 'ով ես', 'ինչ ես'], replyKey: 'faq_ans_who' },
    { keys: ['გაუქმებ', 'შეცვლ', 'cancel', 'change order', 'отмен', 'измен', 'չեղարկ', 'փոփոխ'], replyKey: 'faq_ans_cancel' },
    { keys: ['როგორ', 'შეკვეთ', 'order', 'how to', 'заказ', 'как', 'ինչպես', 'պատվեր'], replyKey: 'faq_ans_how_to_order' }
];

function getSmartReply(userText) {
    const q = userText.toLowerCase();

    const cartKeys = ['კალათ', 'корзин', 'cart', 'զամբյուղ'];
    if (cartKeys.some(k => q.includes(k))) {
        return buildCartStatusReply();
    }

    for (const intent of FAQ_INTENTS) {
        if (intent.keys.some(k => q.includes(k))) {
            return t(intent.replyKey);
        }
    }

    // Fallback: live product search over the catalog already loaded on the page.
    if (allProducts && allProducts.length) {
        const words = q.split(/[\s,.!?;:()]+/).filter(w => w.length >= 3);
        if (words.length) {
            const matches = allProducts
                .filter(p => {
                    const pname = p.name.toLowerCase();
                    return words.some(w => pname.includes(w));
                })
                .slice(0, 5);
            if (matches.length) {
                const list = matches.map(m => `\u2022 ${m.name} \u2014 ${Number(m.price).toFixed(2)} \u20be`).join('\n');
                return `${t('faq_found_products')}\n${list}`;
            }
        }
    }

    return t('faq_fallback');
}

function buildCartStatusReply() {
    if (!cart.length) return t('faq_cart_empty');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const list = cart.map(i => `\u2022 ${i.name} \u2014 ${i.qty} \u00d7 ${i.price.toFixed(2)} \u20be`).join('\n');
    return `${t('faq_cart_intro')}\n${list}\n\n${t('faq_cart_total')}: ${subtotal.toFixed(2)} \u20be`;
}
