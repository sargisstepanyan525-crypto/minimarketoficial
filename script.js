document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');

    // fetch-ის დროს `?t=` უზრუნველყოფს ქეშის გვერდის ავლას GitHub-დან
    fetch('products.json?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error("მონაცემების წაკითხვა ვერ მოხერხდა");
            }
            return response.json();
        })
        .then(products => {
            productList.innerHTML = '';
            
            if (products.length === 0) {
                productList.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">პროდუქტები ჯერ არ არის დამატებული.</p>';
                return;
            }

            products.forEach(item => {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                // ქვეყნის ბეჯი
                const countryBadge = item.country ? `<span class="badge-country"><i class="fa-solid fa-globe"></i> ${item.country}</span>` : '';
                
                // პრიზის ბეჯი
                const prizeBadge = item.isPrize ? `<span class="badge-prize"><i class="fa-solid fa-trophy"></i> საპრიზო!</span>` : '';
                
                // საპრიზო აღწერა
                const prizeDetail = item.isPrize && item.prizeDescription 
                    ? `<div class="prize-text"><i class="fa-solid fa-gift"></i> ${item.prizeDescription}</div>` 
                    : '';

                card.innerHTML = `
                    <div class="card-badges">
                        ${countryBadge}
                        ${prizeBadge}
                    </div>
                    <div class="product-img-wrapper">
                        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200?text=სურათი+არ+არის'">
                    </div>
                    <div class="product-info">
                        <div class="product-title">${item.name}</div>
                        ${prizeDetail}
                        <div class="product-price-row">
                            <span class="product-price">${parseFloat(item.price).toFixed(2)} ₾</span>
                        </div>
                    </div>
                `;
                productList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            productList.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:red;">შეცდომა პროდუქტების ჩატვირთვისას. შეამოწმეთ products.json ფაილი.</p>';
        });

    // AI Chat Toggle Logic
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiChatBox = document.getElementById('ai-chat-box');

    aiToggleBtn.addEventListener('click', () => {
        aiChatBox.classList.toggle('hidden');
    });

    aiCloseBtn.addEventListener('click', () => {
        aiChatBox.classList.add('hidden');
    });
});

// AI Chatbot Logic
function sendAiMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    const messagesContainer = document.getElementById('ai-messages');

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.textContent = text;
    messagesContainer.appendChild(userMsg);

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Generate AI response
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-msg';
        aiMsg.textContent = getAiResponse(text);
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
}

function getAiResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('მისამართი') || q.includes('სად') || q.includes('მდებარეობს')) {
        return "ჩვენი მარკეტი მდებარეობს ქალაქ ახალციხეში, იაძის ქუჩა #2-ში! 📍";
    }
    if (q.includes('ნომერი') || q.includes('ტელეფონი') || q.includes('დარეკვა') || q.includes('კონტაქტი')) {
        return "ჩვენი ცხელი ხაზია: +995 500 22 48 22 📞 (შეგიძლიათ WhatsApp-ზეც მოგვწეროთ).";
    }
    if (q.includes('პრიზი') || q.includes('საჩუქარი') || q.includes('მოგება')) {
        return "ჩვენს პროდუქციას შორის არის სპეციალური 'საპრიზო' ნივთები (ოქროსფერი ბეჯით)! მათ ყიდვისას გადმოგეცემათ საჩუქრები! 🎁";
    }
    if (q.includes('ქვეყანა') || q.includes('იმპორტი') || q.includes('საიდან')) {
        return "ჩვენ გვაქვს უმაღლესი ხარისხის პროდუქცია გერმანიიდან, იტალიიდან, საბერძნეთიდან, თურქეთიდან, საფრანგეთიდან და ადგილობრივი ქართული პროდუქტები! 🌍";
    }
    if (q.includes('გამარჯობა') || q.includes('სალამი') || q.includes('hello')) {
        return "გამარჯობა! במה შემიძლია დაგეხმაროთ დღეს? 😊";
    }
    
    return "გმადლობთ შეკითხვისთვის! დამატებითი დეტალებისთვის შეგიძლიათ დაგვიკავშირდეთ WhatsApp-ზე (+995 500 22 48 22) ან ეწვიოთ MINI MARKET-ს იაძის #2-ში.";
}
