// ================= Multi-language support (KA / EN / RU / HY) =================
// Note: product names (from products.json) and village/community names stay in
// Georgian everywhere, since those are the shop's own catalog data and official
// place names - translating hundreds of specific product names automatically
// would not be reliable. Everything else on the page is translated.
// The order message that gets emailed to the shop always stays in Georgian
// (that's for the shop owner, not the customer).

const translations = {
    ka: {
        hours_label: "სამუშაო საათები: 10:00 - 18:00",
        call_label: "დარეკეთ:",
        brand_tagline: "ახალციხე",
        search_placeholder: "მოძებნეთ პროდუქტი...",
        hero_badge: "შეკვეთა AI კონსულტანტთან ერთად",
        hero_title: "ეზოში შემოსული\nპატარა მარკეტი",
        hero_subtitle: "აირჩიეთ პროდუქტი, დაელაპარაკეთ ჩვენს AI კონსულტანტს — და კურიერი უკვე გზაშია.",
        feature_delivery_label: "სწრაფი მიწოდება",
        feature_delivery_value: "1–2 სთ",
        feature_ai_label: "AI კონსულტანტი",
        feature_ai_value: "24/7",
        feature_secure_label: "დაცული შეკვეთა",
        feature_secure_value: "✓",
        ticket_heading: "დღევანდელი ინფო",
        ticket_hours_label: "მუშაობის საათები",
        ticket_hours_value: "10:00–18:00",
        ticket_zone_label: "მიწოდების ზონა",
        ticket_zone_value: "ქალაქი / სოფელი",
        ticket_fee_label: "მიწოდების ღირებულება",
        ticket_fee_value: "3–20 ₾",
        ticket_free_label: "250 ₾-ზე მეტ შეკვეთაზე",
        ticket_free_value: "უფასო",
        footer_contact_heading: "კონტაქტი",
        footer_hours: "ყოველდღე 10:00 - 18:00",
        footer_bank_heading: "საბანკო რეკვიზიტები",
        footer_copy_text: "ყველა უფლება დაცულია.",
        modal_title: "AI ასისტენტი - შეკვეთის გაფორმება",
        cart_column_title: "თქვენი კალათა",
        cart_empty: "კალათა ცარიელია",
        bill_products: "პროდუქცია:",
        bill_delivery: "მიწოდების საფასური:",
        bill_total: "სულ გადასახდელი:",
        chat_input_placeholder: "ჩაწერთ პასუხი აქ...",
        submit_btn: "შეკვეთის დადასტურება",
        submit_btn_sending: "იგზავნება...",
        submit_btn_retry: "სცადეთ თავიდან",
        greet: "გამარჯობა! მე ვარ Mini Market-ის AI კონსულტანტი. 🛒\n\nსიამოვნებით დაგეხმარებით შეკვეთის გაფორმებაში. გთხოვთ მიუთითოთ თქვენი სახელი და გვარი:",
        ask_personal_id: "გმადლობთ! ახლა გთხოვთ მიუთითოთ თქვენი პირადი ნომერი (ზუსტად 11 ციფრი):",
        err_personal_id: "⚠️ შეცდომა: პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან! გთხოვთ ჩაწერთ ხელახლა.",
        ask_mobile: "შესანიშნავია. რა არის თქვენი მობილურის ნომერი? (მაგ: 599123456 - 9 ციფრი):",
        err_mobile: "⚠️ შეცდომა: ტელეფონის ნომერი არასწორია ან მოკლეა! გთხოვთ მიუთითოთ ზუსტად 9 ციფრიანი ნომერი (მაგ: 599123456).",
        ask_zone: "გთხოვთ აირჩიოთ მიწოდების ზონა:",
        zone_city: "ქალაქი",
        zone_village: "სოფელი",
        ask_village: "აირჩიეთ თქვენი სოფელი/თემი - მიწოდების ფასი ავტომატურად დაითვლება:",
        ask_city_address: "გთხოვთ ჩამიწეროთ ზუსტი მისამართი (ქუჩა, შენობის/სახლის ნომერი):",
        err_address_short: "⚠️ შეცდომა: მისამართი ძალიან მოკლეა! გთხოვთ მიუთითოთ სრული მისამართი შეკვეთის ზუსტად მოსატანად.",
        ask_floor_code: "ხომ ვერ დააზუსტებთ სართულს, ბინის ნომერს, სადარბაზოს კოდს ან სახლის ნიშანს?",
        remind_visit: "💡 შეხსენება: თუ გეჩქარებათ, შეგიძლიათ პირდაპირ მობრძანდეთ ჩვენს მინი მარკეტში იაძის ქუჩა #2ი-ში!\n\nთუმცა, თუ ონლაინ გირჩევნიათ, გავაგრძელოთ 👇",
        ask_freshness: "შეკვეთაში გვაქვს მალფუჭებადი პროდუქტები. ხორცპროდუქტებსა და რძის ნაწარმზე ხომ არ გაქვთ ვარგისიანობის ვადის განსაკუთრებული მოთხოვნა?",
        ask_bread: "პურ-ფუნთუშეულისა და საკონდიტრო ნაწარმის შემთხვევაში, რა სახეობის/ფაქტურის პროდუქტი გირჩევნიათ?",
        ask_allergy: "ხომ არ აქვს ვინმეს ალერგია რომელიმე ინგრედიენტზე (მაგ. ლაქტოზა, გლუტენი, თხილეული)?",
        ask_replacement: "თუ რომელიმე კონკრეტული ბრენდი საწყობში არ აღმოჩნდება, გსურთ თუ არა სხვა ექვივალენტური ბრენდით ჩანაცვლება?",
        ask_delivery_time: "როდის გსურთ კურიერის მოსვლა? (გთხოვთ მიუთითოთ სასურველი დროის ინტერვალი):",
        ask_payment: "გადახდას როგორ გეგმავთ: ნაღდი ანგარიშსწორებით კურიერთან თუ საბანკო გადარიცხვით?",
        ask_change: "თუ ნაღდი ანგარიშსწორებაა, დასჭირდება თუ არა კურიერს ხურდის მოტანა (რა თანხიდან)?",
        finish_msg: "🎉 ყველა მონაცემი ზუსტად შემოწმდა და მიღებულია!\n\nქვემოთ გამოჩნდა ღილაკი — დააჭირეთ და შეკვეთა დასრულდება!",
        success_msg: "✅ თქვენი შეკვეთა წარმატებით მიღებულია! ჩვენი წარმომადგენელი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.\n\nმადლობა რომ გვირჩევთ! 🙏",
        error_send_msg: "⚠️ შეკვეთის გაგზავნისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა ან დაგვირეკოთ ტელეფონით.",
        closed_msg: "⛔ გამარჯობა! ამჟამად არასამუშაო საათებია (10:00 - 18:00).\n\nონლაინ შეკვეთების მიღება დროებით შეჩერებულია. გთხოვთ გვეწვიოთ მარკეტში: ახალციხე, იაძის ქუჩა #2ი!",
        cart_empty_alert: "გთხოვთ, ჯერ დაამატოთ პროდუქტი კალათაში!",
        iban_copied_alert: "ანგარიშის ნომერი კოპირებულია!",
        add_to_cart_btn: "დამატება",
        products_not_found: "პროდუქტი ვერ მოიძებნა.",
        products_load_error: "პროდუქტების ჩატვირთვა ვერ მოხერხდა.",
        loading_products: "იტვირთება..."
    },
    en: {
        hours_label: "Working hours: 10:00 - 18:00",
        call_label: "Call us:",
        brand_tagline: "Akhaltsikhe",
        search_placeholder: "Search for a product...",
        hero_badge: "Order with our AI assistant",
        hero_title: "Your neighbourhood\nmini market",
        hero_subtitle: "Pick your products, chat with our AI assistant - and the courier is already on the way.",
        feature_delivery_label: "Fast delivery",
        feature_delivery_value: "1-2 hrs",
        feature_ai_label: "AI assistant",
        feature_ai_value: "24/7",
        feature_secure_label: "Secure order",
        feature_secure_value: "✓",
        ticket_heading: "Today's info",
        ticket_hours_label: "Working hours",
        ticket_hours_value: "10:00-18:00",
        ticket_zone_label: "Delivery zone",
        ticket_zone_value: "City / Village",
        ticket_fee_label: "Delivery fee",
        ticket_fee_value: "3-20 GEL",
        ticket_free_label: "Orders over 250 GEL",
        ticket_free_value: "Free",
        footer_contact_heading: "Contact",
        footer_hours: "Daily 10:00 - 18:00",
        footer_bank_heading: "Bank details",
        footer_copy_text: "All rights reserved.",
        modal_title: "AI Assistant - Place your order",
        cart_column_title: "Your cart",
        cart_empty: "Your cart is empty",
        bill_products: "Products:",
        bill_delivery: "Delivery fee:",
        bill_total: "Total to pay:",
        chat_input_placeholder: "Type your answer here...",
        submit_btn: "Confirm order",
        submit_btn_sending: "Sending...",
        submit_btn_retry: "Try again",
        greet: "Hello! I'm Mini Market's AI assistant. 🛒\n\nI'll help you place your order. Please tell me your full name:",
        ask_personal_id: "Thank you! Now please enter your personal ID number (exactly 11 digits):",
        err_personal_id: "⚠️ Error: the personal ID number must be exactly 11 digits. Please try again.",
        ask_mobile: "Great. What's your mobile number? (e.g. 599123456 - 9 digits):",
        err_mobile: "⚠️ Error: the phone number is invalid or too short. Please enter exactly 9 digits (e.g. 599123456).",
        ask_zone: "Please choose your delivery zone:",
        zone_city: "City",
        zone_village: "Village",
        ask_village: "Choose your village/community - the delivery fee will be calculated automatically:",
        ask_city_address: "Please write your exact address (street, building/house number):",
        err_address_short: "⚠️ Error: the address is too short. Please provide the full address so we can deliver accurately.",
        ask_floor_code: "Could you specify the floor, apartment number, entrance code, or a landmark for your house?",
        remind_visit: "💡 Reminder: if you're in a hurry, feel free to visit our mini market directly at Iadze St. #2i!\n\nBut if online works better for you, let's continue 👇",
        ask_freshness: "Our order includes perishable products. Do you have any specific expiry-date requirements for meat or dairy products?",
        ask_bread: "For bread and pastries, what type/texture do you prefer?",
        ask_allergy: "Does anyone have an allergy to any ingredient (e.g. lactose, gluten, nuts)?",
        ask_replacement: "If a specific brand is out of stock, would you like it replaced with an equivalent brand?",
        ask_delivery_time: "When would you like the courier to arrive? (please specify your preferred time window):",
        ask_payment: "How would you like to pay: cash on delivery or bank transfer?",
        ask_change: "If paying cash, will the courier need to bring change (from what amount)?",
        finish_msg: "🎉 All details have been checked and received!\n\nA button has appeared below - tap it to complete your order!",
        success_msg: "✅ Your order has been received successfully! Our representative will contact you shortly to confirm the details.\n\nThank you for choosing us! 🙏",
        error_send_msg: "⚠️ Something went wrong while sending your order. Please try again or call us by phone.",
        closed_msg: "⛔ Hello! We're currently outside our working hours (10:00 - 18:00).\n\nOnline orders are temporarily paused. Please visit us at: Akhaltsikhe, Iadze St. #2i!",
        cart_empty_alert: "Please add a product to your cart first!",
        iban_copied_alert: "The account number has been copied!",
        add_to_cart_btn: "Add",
        products_not_found: "No products found.",
        products_load_error: "Failed to load products.",
        loading_products: "Loading..."
    },
    ru: {
        hours_label: "Часы работы: 10:00 - 18:00",
        call_label: "Звоните:",
        brand_tagline: "Ахалцихе",
        search_placeholder: "Поиск товара...",
        hero_badge: "Заказ с помощью AI-консультанта",
        hero_title: "Мини-маркет\nу вашего дома",
        hero_subtitle: "Выберите товары, напишите нашему AI-консультанту - и курьер уже в пути.",
        feature_delivery_label: "Быстрая доставка",
        feature_delivery_value: "1-2 ч",
        feature_ai_label: "AI-консультант",
        feature_ai_value: "24/7",
        feature_secure_label: "Безопасный заказ",
        feature_secure_value: "✓",
        ticket_heading: "Информация на сегодня",
        ticket_hours_label: "Часы работы",
        ticket_hours_value: "10:00-18:00",
        ticket_zone_label: "Зона доставки",
        ticket_zone_value: "Город / Село",
        ticket_fee_label: "Стоимость доставки",
        ticket_fee_value: "3-20 ₾",
        ticket_free_label: "При заказе от 250 ₾",
        ticket_free_value: "Бесплатно",
        footer_contact_heading: "Контакты",
        footer_hours: "Ежедневно 10:00 - 18:00",
        footer_bank_heading: "Банковские реквизиты",
        footer_copy_text: "Все права защищены.",
        modal_title: "AI-ассистент - оформление заказа",
        cart_column_title: "Ваша корзина",
        cart_empty: "Корзина пуста",
        bill_products: "Товары:",
        bill_delivery: "Стоимость доставки:",
        bill_total: "Итого к оплате:",
        chat_input_placeholder: "Введите ответ здесь...",
        submit_btn: "Подтвердить заказ",
        submit_btn_sending: "Отправка...",
        submit_btn_retry: "Попробовать снова",
        greet: "Здравствуйте! Я AI-консультант Mini Market. 🛒\n\nС удовольствием помогу оформить заказ. Пожалуйста, напишите ваше имя и фамилию:",
        ask_personal_id: "Спасибо! Теперь укажите ваш личный номер (ровно 11 цифр):",
        err_personal_id: "⚠️ Ошибка: личный номер должен состоять ровно из 11 цифр. Пожалуйста, введите заново.",
        ask_mobile: "Отлично. Какой у вас номер мобильного телефона? (например 599123456 - 9 цифр):",
        err_mobile: "⚠️ Ошибка: номер телефона неверен или слишком короткий. Введите ровно 9 цифр (например 599123456).",
        ask_zone: "Пожалуйста, выберите зону доставки:",
        zone_city: "Город",
        zone_village: "Село",
        ask_village: "Выберите ваше село/общину - стоимость доставки рассчитается автоматически:",
        ask_city_address: "Пожалуйста, напишите точный адрес (улица, номер дома/здания):",
        err_address_short: "⚠️ Ошибка: адрес слишком короткий. Укажите полный адрес, чтобы мы могли точно доставить заказ.",
        ask_floor_code: "Не могли бы вы уточнить этаж, номер квартиры, код подъезда или ориентир дома?",
        remind_visit: "💡 Напоминание: если вы спешите, вы можете посетить наш мини-маркет напрямую по адресу ул. Иадзе №2и!\n\nНо если вам удобнее онлайн, продолжим 👇",
        ask_freshness: "В заказе есть скоропортящиеся продукты. Есть ли у вас особые требования к сроку годности мясных и молочных продуктов?",
        ask_bread: "Что касается хлеба и выпечки, какой вид/текстуру вы предпочитаете?",
        ask_allergy: "Есть ли у кого-то аллергия на какой-либо ингредиент (например, лактоза, глютен, орехи)?",
        ask_replacement: "Если конкретного бренда не окажется на складе, хотите ли вы замену на аналогичный бренд?",
        ask_delivery_time: "Когда вам удобно, чтобы приехал курьер? (укажите предпочтительный промежуток времени):",
        ask_payment: "Как планируете оплатить: наличными курьеру или банковским переводом?",
        ask_change: "Если оплата наличными, нужна ли курьеру сдача (с какой суммы)?",
        finish_msg: "🎉 Все данные проверены и приняты!\n\nНиже появилась кнопка - нажмите её, чтобы завершить заказ!",
        success_msg: "✅ Ваш заказ успешно получен! Наш представитель скоро свяжется с вами для уточнения деталей.\n\nСпасибо, что выбрали нас! 🙏",
        error_send_msg: "⚠️ При отправке заказа произошла ошибка. Пожалуйста, попробуйте снова или позвоните нам.",
        closed_msg: "⛔ Здравствуйте! Сейчас нерабочее время (10:00 - 18:00).\n\nПриём онлайн-заказов временно приостановлен. Пожалуйста, посетите нас: Ахалцихе, ул. Иадзе №2и!",
        cart_empty_alert: "Пожалуйста, сначала добавьте товар в корзину!",
        iban_copied_alert: "Номер счёта скопирован!",
        add_to_cart_btn: "Добавить",
        products_not_found: "Товар не найден.",
        products_load_error: "Не удалось загрузить товары.",
        loading_products: "Загрузка..."
    },
    hy: {
        hours_label: "Աշխատանքային ժամեր՝ 10:00 - 18:00",
        call_label: "Զանգահարեք՝",
        brand_tagline: "Ախալցխա",
        search_placeholder: "Փնտրել ապրանք...",
        hero_badge: "Պատվեր AI խորհրդատուի միջոցով",
        hero_title: "Ձեր թաղամասի\nմինի շուկան",
        hero_subtitle: "Ընտրեք ապրանքները, գրեք մեր AI խորհրդատուին, և առաքիչն արդեն ճանապարհին է:",
        feature_delivery_label: "Արագ առաքում",
        feature_delivery_value: "1-2 ժ",
        feature_ai_label: "AI խորհրդատու",
        feature_ai_value: "24/7",
        feature_secure_label: "Անվտանգ պատվեր",
        feature_secure_value: "✓",
        ticket_heading: "Այսօրվա տեղեկատվություն",
        ticket_hours_label: "Աշխատանքային ժամեր",
        ticket_hours_value: "10:00-18:00",
        ticket_zone_label: "Առաքման գոտի",
        ticket_zone_value: "Քաղաք / Գյուղ",
        ticket_fee_label: "Առաքման արժեք",
        ticket_fee_value: "3-20 ₾",
        ticket_free_label: "250 ₾-ից ավելի պատվերի դեպքում",
        ticket_free_value: "Անվճար",
        footer_contact_heading: "Կապ",
        footer_hours: "Ամեն օր 10:00 - 18:00",
        footer_bank_heading: "Բանկային տվյալներ",
        footer_copy_text: "Բոլոր իրավունքները պաշտպանված են.",
        modal_title: "AI օգնական - Պատվերի ձևակերպում",
        cart_column_title: "Ձեր զամբյուղը",
        cart_empty: "Զամբյուղը դատարկ է",
        bill_products: "Ապրանքներ՝",
        bill_delivery: "Առաքման արժեք՝",
        bill_total: "Ընդամենը վճարման ենթակա՝",
        chat_input_placeholder: "Գրեք ձեր պատասխանը այստեղ...",
        submit_btn: "Հաստատել պատվերը",
        submit_btn_sending: "Ուղարկվում է...",
        submit_btn_retry: "Փորձեք կրկին",
        greet: "Բարև Ձեզ! Ես Mini Market-ի AI խորհրդատուն եմ։ 🛒\n\nՈւրախ կլինեմ օգնել ձեզ պատվերը ձևակերպելիս: Խնդրում եմ նշեք ձեր անուն-ազգանունը:",
        ask_personal_id: "Շնորհակալություն! Այժմ խնդրում ենք նշել ձեր անձնագրի/քաղաքացու համարանիշը (ուղիղ 11 թիվ):",
        err_personal_id: "⚠️ Սխալ. համարանիշը պետք է կազմված լինի ուղիղ 11 թվանշանից: Խնդրում ենք կրկին փորձել:",
        ask_mobile: "Հիանալի է: Ո՞րն է ձեր բջջային հեռախոսահամարը: (օր.՝ 599123456 - 9 թվանշան):",
        err_mobile: "⚠️ Սխալ. հեռախոսահամարը սխալ է կամ չափազանց կարճ: Խնդրում ենք նշել ուղիղ 9 թվանշան (օր.՝ 599123456):",
        ask_zone: "Խնդրում ենք ընտրել առաքման գոտին:",
        zone_city: "Քաղաք",
        zone_village: "Գյուղ",
        ask_village: "Ընտրեք ձեր գյուղը/համայնքը - առաքման արժեքը ավտոմատ կհաշվարկվի:",
        ask_city_address: "Խնդրում ենք գրել ձեր ճշգրիտ հասցեն (փողոց, շենքի/տան համար):",
        err_address_short: "⚠️ Սխալ. հասցեն շատ կարճ է: Խնդրում ենք նշել ամբողջական հասցեն, որպեսզի ճշգրիտ առաքենք:",
        ask_floor_code: "Կարո՞ղ եք ճշտել հարկը, բնակարանի համարը, մուտքի կոդը կամ տան նշանը:",
        remind_visit: "💡 Հիշեցում. եթե շտապում եք, կարող եք ուղղակիորեն այցելել մեր մինի շուկան՝ Իաձեի փողոց #2ի հասցեով!\n\nԲայց եթե նախընտրում եք առցանց, շարունակենք 👇",
        ask_freshness: "Պատվերում կան արագ փչացող ապրանքներ: Մսամթերքի և կաթնամթերքի պիտանիության ժամկետի հատուկ պահանջ ունե՞ք:",
        ask_bread: "Հացաբուլկեղենի և հրուշակեղենի դեպքում ի՞նչ տեսակ/հյուսվածք եք նախընտրում:",
        ask_allergy: "Որևէ մեկը որևէ բաղադրիչի նկատմամբ ալերգիա ունի՞ (օր.՝ լակտոզա, գլյուտեն, ընկույզեղեն):",
        ask_replacement: "Եթե կոնկրետ ապրանքանիշը պահեստում չլինի, ցանկանո՞ւմ եք փոխարինել համարժեք այլ ապրանքանիշով:",
        ask_delivery_time: "Ե՞րբ եք ցանկանում առաքիչի ժամանումը (խնդրում ենք նշել նախընտրելի ժամանակահատվածը):",
        ask_payment: "Ինչպե՞ս եք նախատեսում վճարել՝ կանխիկ առաքիչին, թե՞ բանկային փոխանցմամբ:",
        ask_change: "Կանխիկ վճարման դեպքում առաքիչին մանրադրամ պե՞տք կլինի (ինչքանի՞ց):",
        finish_msg: "🎉 Բոլոր տվյալները ստուգված և ընդունված են:\n\nՆերքևում կոճակ է հայտնվել — սեղմեք, և պատվերն ավարտված կլինի:",
        success_msg: "✅ Ձեր պատվերը հաջողությամբ ընդունված է: Մեր ներկայացուցիչը շուտով կկապվի ձեզ հետ մանրամասները ճշտելու համար:\n\nՇնորհակալություն, որ ընտրեցիք մեզ! 🙏",
        error_send_msg: "⚠️ Պատվերն ուղարկելիս սխալ տեղի ունեցավ: Խնդրում ենք կրկին փորձել կամ զանգահարել մեզ:",
        closed_msg: "⛔ Բարև Ձեզ! Այս պահին ոչ աշխատանքային ժամեր են (10:00 - 18:00)։\n\nԱռցանց պատվերների ընդունումը ժամանակավորապես դադարեցված է: Խնդրում ենք այցելել մեզ՝ Ախալցխա, Իաձեի փող. #2ի!",
        cart_empty_alert: "Խնդրում ենք սկզբում զամբյուղում ապրանք ավելացնել:",
        iban_copied_alert: "Հաշվեհամարը պատճենվել է:",
        add_to_cart_btn: "Ավելացնել",
        products_not_found: "Ապրանք չի գտնվել:",
        products_load_error: "Ապրանքները չհաջողվեց բեռնել:",
        loading_products: "Բեռնվում է..."
    }
};

let currentLang = localStorage.getItem('mm_lang') || 'ka';

function t(key) {
    const dict = translations[currentLang] || translations.ka;
    return (dict && dict[key] !== undefined) ? dict[key] : (translations.ka[key] !== undefined ? translations.ka[key] : key);
}

function applyLanguage(lang) {
    if (!translations[lang]) lang = 'ka';
    currentLang = lang;
    localStorage.setItem('mm_lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = t(key);
        if (el.getAttribute('data-i18n-html') === 'true') {
            el.innerHTML = value.split('\n').join('<br>');
        } else {
            el.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // refresh dynamic bits that read translations directly (product grid, cart list)
    if (typeof allProducts !== 'undefined' && allProducts && allProducts.length && typeof renderProducts === 'function') {
        renderProducts(allProducts);
    }
    if (typeof cart !== 'undefined' && typeof renderCartItems === 'function') {
        renderCartItems();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });
    applyLanguage(currentLang);
});
