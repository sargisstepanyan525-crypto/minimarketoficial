document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');

    fetch('products.json?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error("მონაცემების წაკითხვა ვერ მოხერხდა");
            }
            return response.json();
        })
        .then(products => {
            productList.innerHTML = '';
            
            if (!products || products.length === 0) {
                productList.innerHTML = '<p>პროდუქტები ჯერ არ არის დამატებული.</p>';
                return;
            }

            products.forEach(item => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=სურათი+არ+არის'">
                    <div class="product-title">${item.name}</div>
                    <div class="product-price">${parseFloat(item.price).toFixed(2)} ₾</div>
                `;
                productList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            productList.innerHTML = '<p style="color:red;">შეცდომა პროდუქტების ჩატვირთვისას.</p>';
        });
});
