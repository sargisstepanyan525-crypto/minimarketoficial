// Product name translations, keyed by the exact Georgian name in products.json.
// Used only for display (grid, cart, AI search results); order emails to the
// shop always use the original Georgian name from products.json for clarity.
const PRODUCT_NAME_TRANSLATIONS = {
    "ლატინო ყავა სომხური პრიზიანი": {
        "en": "Latino Coffee, Armenian (Prizian)",
        "ru": "Кофе Латино, армянский (Prizian)",
        "hy": "Լատինո սուրճ, հայկական (Prizian)",
        "tr": "Latino Kahve, Ermeni (Prizian)",
        "zh": "拿铁咖啡（亚美尼亚产，Prizian）"
    },
    "ტუალეტის ქაღალდი ელფი": {
        "en": "Toilet Paper Elfi",
        "ru": "Туалетная бумага Elfi",
        "hy": "Զուգարանի թուղթ Elfi",
        "tr": "Tuvalet Kağıdı Elfi",
        "zh": "卫生纸 Elfi"
    },
    "ტუალტის ქაღალდი 65": {
        "en": "Toilet Paper 65",
        "ru": "Туалетная бумага 65",
        "hy": "Զուգարանի թուղթ 65",
        "tr": "Tuvalet Kağıdı 65",
        "zh": "卫生纸 65"
    },
    "სარეცხის ფხვნილი orei": {
        "en": "Laundry Powder Orei",
        "ru": "Стиральный порошок Orei",
        "hy": "Լվացքի փոշի Orei",
        "tr": "Çamaşır Tozu Orei",
        "zh": "洗衣粉 Orei"
    },
    "სარეცხის საშვალება FAiRY": {
        "en": "Dish Soap Fairy",
        "ru": "Средство для мытья посуды Fairy",
        "hy": "Ամանեղենի լվացող միջոց Fairy",
        "tr": "Bulaşık Deterjanı Fairy",
        "zh": "洗洁精 Fairy"
    },
    "წვენი ჯუსა": {
        "en": "Juice Jusa",
        "ru": "Сок Jusa",
        "hy": "Հյութ Jusa",
        "tr": "Meyve Suyu Jusa",
        "zh": "果汁 Jusa"
    },
    "კოკ-კოლა კლასიკი": {
        "en": "Coca-Cola Classic",
        "ru": "Кока-Кола Классик",
        "hy": "Կոկա-Կոլա Քլասիք",
        "tr": "Coca-Cola Klasik",
        "zh": "可口可乐经典"
    },
    "ფანტა": {
        "en": "Fanta",
        "ru": "Фанта",
        "hy": "Ֆանտա",
        "tr": "Fanta",
        "zh": "芬达"
    },
    "ზეთის ხილი სომხური ALLEO ": {
        "en": "Olives, Armenian (Alleo)",
        "ru": "Оливки, армянские (Alleo)",
        "hy": "Ձիթապտուղ, հայկական (Alleo)",
        "tr": "Zeytin, Ermeni (Alleo)",
        "zh": "橄榄（亚美尼亚产，Alleo）"
    },
    "ქათმის ბარკალი უკრაინული": {
        "en": "Chicken Drumsticks, Ukrainian",
        "ru": "Куриные голени, украинские",
        "hy": "Հավի ազդր, ուկրաինական",
        "tr": "Tavuk But, Ukrayna",
        "zh": "鸡腿（乌克兰产）"
    },
    "მაკარონი ერიშტა": {
        "en": "Pasta Erishta",
        "ru": "Макароны Эришта",
        "hy": "Մակարոն Erishta",
        "tr": "Makarna Erishta",
        "zh": "意面 Erishta"
    },
    "მაკარონი ანკარ თურქული": {
        "en": "Pasta Ankar, Turkish",
        "ru": "Макароны Ankar, турецкие",
        "hy": "Մակարոն Ankar, թուրքական",
        "tr": "Makarna Ankar, Türk",
        "zh": "意面 Ankar（土耳其产）"
    },
    "იმპერიის გემო მცენარული ერბო სომხური 400 გრ": {
        "en": "Vegetable Margarine Imperia Gemo, Armenian, 400g",
        "ru": "Маргарин растительный Imperia Gemo, армянский, 400г",
        "hy": "Բուսական մարգարին Imperia Gemo, հայկական, 400գ",
        "tr": "Bitkisel Margarin Imperia Gemo, Ermeni, 400g",
        "zh": "植物人造黄油 Imperia Gemo（亚美尼亚产，400克）"
    },
    "არაყი ხლებნაია რუსული": {
        "en": "Vodka Khlebnaya, Russian",
        "ru": "Водка Хлебная, русская",
        "hy": "Օղի Khlebnaya, ռուսական",
        "tr": "Votka Khlebnaya, Rus",
        "zh": "伏特加 Khlebnaya（俄罗斯产）"
    },
    "მეზსუმზირა ოტ მარტინა ": {
        "en": "Sunflower Seeds Ot Martina",
        "ru": "Семечки Ot Martina",
        "hy": "Արևածաղկի սերմեր Ot Martina",
        "tr": "Ayçekirdeği Ot Martina",
        "zh": "葵花籽 Ot Martina"
    },
    "მზესუმზირა ოტ მარტინა მარილიანი": {
        "en": "Sunflower Seeds Ot Martina, Salted",
        "ru": "Семечки Ot Martina, солёные",
        "hy": "Արևածաղկի սերմեր Ot Martina, աղի",
        "tr": "Ayçekirdeği Ot Martina, Tuzlu",
        "zh": "葵花籽 Ot Martina（咸味）"
    },
    "მზესუმზირა მოლოდოჟნი": {
        "en": "Sunflower Seeds Molodozhni",
        "ru": "Семечки Молодежные",
        "hy": "Արևածաղկի սերմեր Molodozhni",
        "tr": "Ayçekirdeği Molodozhni",
        "zh": "葵花籽 Molodozhni"
    },
    "მზესუმზირა მოლოდოჟნი მარილიანი": {
        "en": "Sunflower Seeds Molodozhni, Salted",
        "ru": "Семечки Молодежные, солёные",
        "hy": "Արևածաղկի սերմեր Molodozhni, աղի",
        "tr": "Ayçekirdeği Molodozhni, Tuzlu",
        "zh": "葵花籽 Molodozhni（咸味）"
    },
    "შოკოლადი ტიმი რუსული 0.5კგ": {
        "en": "Chocolate Timi, Russian, 0.5kg",
        "ru": "Шоколад Тимми, российский, 0.5кг",
        "hy": "Շոկոլադ Timi, ռուսական, 0.5կգ",
        "tr": "Çikolata Timi, Rus, 0.5kg",
        "zh": "巧克力 Timi（俄罗斯产，0.5公斤）"
    },
    "ტომატის პასტა ელდორადო": {
        "en": "Tomato Paste Eldorado",
        "ru": "Томатная паста Eldorado",
        "hy": "Լոլիկի մածուկ Eldorado",
        "tr": "Domates Salçası Eldorado",
        "zh": "番茄酱 Eldorado"
    },
    "ხიზილალა არტფუდი სომხური": {
        "en": "Caviar ArtFood, Armenian",
        "ru": "Икра ArtFood, армянская",
        "hy": "Խավիար ArtFood, հայկական",
        "tr": "Havyar ArtFood, Ermeni",
        "zh": "鱼子酱 ArtFood（亚美尼亚产）"
    },
    "ხიზილალა არტფუდი სომხური მწარე": {
        "en": "Caviar ArtFood, Armenian, Spicy",
        "ru": "Икра ArtFood, армянская, острая",
        "hy": "Խավիար ArtFood, հայկական, կծու",
        "tr": "Havyar ArtFood, Ermeni, Acılı",
        "zh": "鱼子酱 ArtFood（亚美尼亚产，辣味）"
    },
    "ჩიფსი ოტ მარტინა": {
        "en": "Chips Ot Martina",
        "ru": "Чипсы Ot Martina",
        "hy": "Չիպս Ot Martina",
        "tr": "Cips Ot Martina",
        "zh": "薯片 Ot Martina"
    },
    "ოტ მარტინა ჩიფსი ბალიში": {
        "en": "Ot Martina Pillow Snacks",
        "ru": "Ot Martina подушечки",
        "hy": "Ot Martina բարձիկներ",
        "tr": "Ot Martina Yastık Cips",
        "zh": "Ot Martina 枕头形薯片"
    },
    "ოტ მარტინა მზესუმზირა ზოლიანი": {
        "en": "Ot Martina Striped Sunflower Seeds",
        "ru": "Ot Martina семечки полосатые",
        "hy": "Ot Martina արևածաղկի շերտավոր սերմեր",
        "tr": "Ot Martina Çizgili Ayçekirdeği",
        "zh": "Ot Martina 条纹葵花籽"
    },
    "ოტ მარტინა მზესუმზირა ზოლიანი მარილიანი": {
        "en": "Ot Martina Striped Sunflower Seeds, Salted",
        "ru": "Ot Martina семечки полосатые, солёные",
        "hy": "Ot Martina արևածաղկի շերտավոր սերմեր, աղի",
        "tr": "Ot Martina Çizgili Ayçekirdeği, Tuzlu",
        "zh": "Ot Martina 条纹葵花籽（咸味）"
    },
    "ქათმის ფრთა": {
        "en": "Chicken Wings",
        "ru": "Куриные крылья",
        "hy": "Հավի թև",
        "tr": "Tavuk Kanadı",
        "zh": "鸡翅"
    },
    "ქათმის ფილე": {
        "en": "Chicken Fillet",
        "ru": "Куриное филе",
        "hy": "Հավի ֆիլե",
        "tr": "Tavuk Fileto",
        "zh": "鸡胸肉"
    },
    "გაყინული ღორის ხორცი": {
        "en": "Frozen Pork",
        "ru": "Замороженная свинина",
        "hy": "Սառեցված խոզի միս",
        "tr": "Dondurulmuş Domuz Eti",
        "zh": "冷冻猪肉"
    },
    "შავი საპონი 72%": {
        "en": "Laundry Soap Bar 72%",
        "ru": "Хозяйственное мыло 72%",
        "hy": "Տնտեսական օճառ 72%",
        "tr": "Sabun (Çamaşır) %72",
        "zh": "72%洗衣皂"
    },
    "სუფრის მარილი": {
        "en": "Table Salt",
        "ru": "Столовая соль",
        "hy": "Սեղանի աղ",
        "tr": "Sofra Tuzu",
        "zh": "食用盐"
    },
    "კიტრი ქართული 1კგ": {
        "en": "Cucumbers, Georgian, 1kg",
        "ru": "Огурцы, грузинские, 1кг",
        "hy": "Վարունգ, վրացական, 1կգ",
        "tr": "Salatalık, Gürcü, 1kg",
        "zh": "黄瓜（格鲁吉亚产，1公斤）"
    },
    "პომიდორი ქართული 1კგ": {
        "en": "Tomatoes, Georgian, 1kg",
        "ru": "Помидоры, грузинские, 1кг",
        "hy": "Լոլիկ, վրացական, 1կգ",
        "tr": "Domates, Gürcü, 1kg",
        "zh": "番茄（格鲁吉亚产，1公斤）"
    },
    "კოკა-კოლა ქილა 150 მლ.": {
        "en": "Coca-Cola Can, 150ml",
        "ru": "Кока-Кола банка, 150мл",
        "hy": "Կոկա-Կոլա, թիթեղյա շիշ, 150մլ",
        "tr": "Coca-Cola Kutu, 150ml",
        "zh": "可口可乐罐装（150毫升）"
    },
    "ფანტა ქილა 150 მლ.": {
        "en": "Fanta Can, 150ml",
        "ru": "Фанта банка, 150мл",
        "hy": "Ֆանտա, թիթեղյա շիշ, 150մլ",
        "tr": "Fanta Kutu, 150ml",
        "zh": "芬达罐装（150毫升）"
    },
    "ასანთი ლეოპარდი 1 შეკვრა": {
        "en": "Matches Leopardi, 1 Pack",
        "ru": "Спички Leopardi, 1 упаковка",
        "hy": "Լուցկի Leopardi, 1 տուփ",
        "tr": "Kibrit Leopardi, 1 Paket",
        "zh": "火柴 Leopardi（1包）"
    },
    "მინირალური წყალი ლიკანი 1ლ.": {
        "en": "Mineral Water Likani, 1L",
        "ru": "Минеральная вода Ликани, 1л",
        "hy": "Հանքային ջուր Likani, 1լ",
        "tr": "Maden Suyu Likani, 1L",
        "zh": "矿泉水 Likani（1升）"
    },
    "მინირალური წყალი ნაბეღლავი 1ლ.": {
        "en": "Mineral Water Nabeghlavi, 1L",
        "ru": "Минеральная вода Набегдави, 1л",
        "hy": "Հանքային ջուր Nabeghlavi, 1լ",
        "tr": "Maden Suyu Nabeghlavi, 1L",
        "zh": "矿泉水 Nabeghlavi（1升）"
    },
    "მინირალური წყალი ბორჯომი 1ლ.": {
        "en": "Mineral Water Borjomi, 1L",
        "ru": "Минеральная вода Боржоми, 1л",
        "hy": "Հանքային ջուր Բորժոմի, 1լ",
        "tr": "Maden Suyu Borjomi, 1L",
        "zh": "矿泉水 Borjomi（1升）"
    },
    "ენერგეტიკული სასმელი- ,,ბერნი,, 0.25 მლ": {
        "en": "Energy Drink Burn, 0.25L",
        "ru": "Энергетический напиток Burn, 0.25л",
        "hy": "Էներգետիկ ըմպելիք Burn, 0.25լ",
        "tr": "Enerji İçeceği Burn, 0.25L",
        "zh": "能量饮料 Burn（0.25升）"
    },
    "შესქელებული რძის შემცვლელი პროდუქტი ელდორადო": {
        "en": "Condensed Milk Substitute Eldorado",
        "ru": "Сгущённый молокосодержащий продукт Eldorado",
        "hy": "Խտացրած կաթի փոխարինիչ Eldorado",
        "tr": "Yoğunlaştırılmış Süt Ürünü Eldorado",
        "zh": "炼乳替代产品 Eldorado"
    },
    "წიწიბურა ოლინპი 0.8კგ": {
        "en": "Buckwheat Olimpi, 0.8kg",
        "ru": "Гречка Olimpi, 0.8кг",
        "hy": "Հնդկացորեն Olimpi, 0.8կգ",
        "tr": "Karabuğday Olimpi, 0.8kg",
        "zh": "荞麦 Olimpi（0.8公斤）"
    },
    "ბრინჯი ოლიმპი 0.8კგ": {
        "en": "Rice Olimpi, 0.8kg",
        "ru": "Рис Olimpi, 0.8кг",
        "hy": "Բրինձ Olimpi, 0.8կգ",
        "tr": "Pirinç Olimpi, 0.8kg",
        "zh": "大米 Olimpi（0.8公斤）"
    },
    "კეჩუპი პრემო კლასიკური": {
        "en": "Ketchup Premo Classic",
        "ru": "Кетчуп Premo Классический",
        "hy": "Կետչուպ Premo Classic",
        "tr": "Ketçap Premo Klasik",
        "zh": "番茄酱 Premo 经典"
    },
    "სპრედი რძის სამყარო ალპენ მილკ": {
        "en": "Spread Alpen Milk",
        "ru": "Спред Alpen Milk",
        "hy": "Սփրեդ Alpen Milk",
        "tr": "Margarin Alpen Milk",
        "zh": "涂抹酱 Alpen Milk"
    },
    "ყავა მეამა": {
        "en": "Coffee Meama",
        "ru": "Кофе Meama",
        "hy": "Սուրճ Meama",
        "tr": "Kahve Meama",
        "zh": "咖啡 Meama"
    },
    "სწრაფი მომზადების ვერმიშელი საქონლის": {
        "en": "Instant Noodles, Beef",
        "ru": "Вермишель быстрого приготовления, говядина",
        "hy": "Արագ պատրաստվող լապշա, տավարի",
        "tr": "Hazır Erişte, Dana Etli",
        "zh": "方便面（牛肉味）"
    },
    "საკვები სოდა 0.5კგ": {
        "en": "Baking Soda, 0.5kg",
        "ru": "Пищевая сода, 0.5кг",
        "hy": "Ուտելի սոդա, 0.5կգ",
        "tr": "Karbonat, 0.5kg",
        "zh": "食用小苏打（0.5公斤）"
    },
    "წყალი მთის 0.5ლ.": {
        "en": "Mountain Water, 0.5L",
        "ru": "Горная вода, 0.5л",
        "hy": "Լեռնային ջուր, 0.5լ",
        "tr": "Dağ Suyu, 0.5L",
        "zh": "山泉水（0.5升）"
    },
    "მაიონეზი ალივიე პროვანსალი 200გრ": {
        "en": "Mayonnaise Olivie Provençal, 200g",
        "ru": "Майонез Оливье Провансаль, 200г",
        "hy": "Մայոնեզ Olivie Provençal, 200գ",
        "tr": "Mayonez Olivie Provençal, 200g",
        "zh": "蛋黄酱 Olivie Provençal（200克）"
    },
    "სალფეთქი სელპაკი": {
        "en": "Napkins Selpak",
        "ru": "Салфетки Selpak",
        "hy": "Անձեռոցիկ Selpak",
        "tr": "Peçete Selpak",
        "zh": "纸巾 Selpak"
    },
    "სამზარეულოს სალფეთქი": {
        "en": "Kitchen Paper Towels",
        "ru": "Кухонные полотенца",
        "hy": "Խոհանոցային անձեռոցիկ",
        "tr": "Mutfak Kağıt Havlusu",
        "zh": "厨房纸巾"
    },
    "სალფეტქი SUN": {
        "en": "Napkins Sun",
        "ru": "Салфетки Sun",
        "hy": "Անձեռոցիկ Sun",
        "tr": "Peçete Sun",
        "zh": "纸巾 Sun"
    },
    "იაშკინო ვაფლი შოკოლადის 200 გრ.": {
        "en": "Wafers Yashkino, Chocolate, 200g",
        "ru": "Вафли Yashkino, шоколадные, 200г",
        "hy": "Վաֆլի Yashkino, շոկոլադե, 200գ",
        "tr": "Gofret Yashkino, Çikolatalı, 200g",
        "zh": "华夫饼 Yashkino（巧克力味，200克）"
    },
    "ვაფლი იაშკინო სხვა და სხვა": {
        "en": "Wafers Yashkino, Assorted",
        "ru": "Вафли Yashkino, ассорти",
        "hy": "Վաֆլի Yashkino, զանազան",
        "tr": "Gofret Yashkino, Çeşitli",
        "zh": "华夫饼 Yashkino（综合口味）"
    },
    "შოკოლადი კნაჟესკი 1 კგ.": {
        "en": "Chocolate Knyazhesky, 1kg",
        "ru": "Шоколад Княжеский, 1кг",
        "hy": "Շոկոլադ Knyazhesky, 1կգ",
        "tr": "Çikolata Knyazhesky, 1kg",
        "zh": "巧克力 Knyazhesky（1公斤）"
    },
    "გრანდ ქენდი შოკოლადი ჩირის ასორტი": {
        "en": "Chocolate Grand Candy, Dried Fruit Assortment",
        "ru": "Шоколад Grand Candy, ассорти с сухофруктами",
        "hy": "Շոկոլադ Grand Candy, չիրի տեսականի",
        "tr": "Çikolata Grand Candy, Kuru Meyveli Karışık",
        "zh": "巧克力 Grand Candy（果干什锦）"
    },
    "სუჯუხი ბეკონ პროდუქტი სომხეთი": {
        "en": "Sujukh, Bacon Product, Armenia",
        "ru": "Суджух, бекон-продукт, Армения",
        "hy": "Սուջուխ, բեկոն մթերք, Հայաստան",
        "tr": "Sucuk, Bacon Ürünü, Ermenistan",
        "zh": "香肠（培根制品，亚美尼亚产）"
    },
    "ბასტურმა ბეკონ პროდუქტი სომხეთი": {
        "en": "Basturma, Bacon Product, Armenia",
        "ru": "Бастурма, бекон-продукт, Армения",
        "hy": "Բաստուրմա, բեկոն մթերք, Հայաստան",
        "tr": "Pastırma, Bacon Ürünü, Ermenistan",
        "zh": "巴斯图尔马腌肉（培根制品，亚美尼亚产）"
    },
    "ლუდი კილიკია 0.33 სომხური": {
        "en": "Beer Kilikia, Armenian, 0.33L",
        "ru": "Пиво Kilikia, армянское, 0.33л",
        "hy": "Գարեջուր Կիլիկիա, հայկական, 0.33լ",
        "tr": "Bira Kilikia, Ermeni, 0.33L",
        "zh": "啤酒 Kilikia（亚美尼亚产，0.33升）"
    },
    "ლუდი დილიჯანი 0.33 სომხური": {
        "en": "Beer Dilijan, Armenian, 0.33L",
        "ru": "Пиво Dilijan, армянское, 0.33л",
        "hy": "Գարեջուր Դիլիջան, հայկական, 0.33լ",
        "tr": "Bira Dilijan, Ermeni, 0.33L",
        "zh": "啤酒 Dilijan（亚美尼亚产，0.33升）"
    },
    "საწმენდი გუპკა": {
        "en": "Cleaning Sponge",
        "ru": "Губка для мытья посуды",
        "hy": "Մաքրող սպունգ",
        "tr": "Temizlik Süngeri",
        "zh": "清洁海绵"
    },
    "ხელთათმანი ერთჯერადი": {
        "en": "Disposable Gloves",
        "ru": "Одноразовые перчатки",
        "hy": "Միանգամյա օգտագործման ձեռնոց",
        "tr": "Tek Kullanımlık Eldiven",
        "zh": "一次性手套"
    },
    "სველი ხელსახოცი": {
        "en": "Wet Wipes",
        "ru": "Влажные салфетки",
        "hy": "Թաց անձեռոցիկ",
        "tr": "Islak Mendil",
        "zh": "湿巾"
    },
    "ქათმის ბულიონი გალინა ბლანკა": {
        "en": "Chicken Bouillon Gallina Blanca",
        "ru": "Куриный бульон Gallina Blanca",
        "hy": "Հավի արգանակի խորանարդ Gallina Blanca",
        "tr": "Tavuk Bulyon Gallina Blanca",
        "zh": "鸡汤块 Gallina Blanca"
    },
    "საქონლის ბულიონი გალინა ბლანკა": {
        "en": "Beef Bouillon Gallina Blanca",
        "ru": "Говяжий бульон Gallina Blanca",
        "hy": "Տավարի արգանակի խորանարդ Gallina Blanca",
        "tr": "Dana Bulyon Gallina Blanca",
        "zh": "牛肉汤块 Gallina Blanca"
    },
    "საფუარი მშრალი პაკმაია 100 გრ.": {
        "en": "Dry Yeast Pakmaya, 100g",
        "ru": "Сухие дрожжи Pakmaya, 100г",
        "hy": "Չոր խմորիչ Pakmaya, 100գ",
        "tr": "Kuru Maya Pakmaya, 100g",
        "zh": "干酵母 Pakmaya（100克）"
    },
    "საფუარი მშრალი 100 გრ. ": {
        "en": "Dry Yeast, 100g",
        "ru": "Сухие дрожжи, 100г",
        "hy": "Չոր խմորիչ, 100գ",
        "tr": "Kuru Maya, 100g",
        "zh": "干酵母（100克）"
    },
    "ტილოები გერმანული": {
        "en": "Cleaning Cloths, German",
        "ru": "Тряпки для уборки, немецкие",
        "hy": "Մաքրող լաթեր, գերմանական",
        "tr": "Temizlik Bezi, Alman",
        "zh": "清洁抹布（德国产）"
    },
    "ნაჭერი მრავალჯერადი ჩინური": {
        "en": "Reusable Cloth, Chinese",
        "ru": "Многоразовая тряпка, китайская",
        "hy": "Բազմակի օգտագործման լաթ, չինական",
        "tr": "Yeniden Kullanılabilir Bez, Çin",
        "zh": "可重复使用抹布（中国产）"
    },
    "ვანილი სომხური წარმოების ": {
        "en": "Vanilla, Armenian",
        "ru": "Ваниль, армянская",
        "hy": "Վանիլին, հայկական արտադրության",
        "tr": "Vanilya, Ermeni Üretimi",
        "zh": "香草（亚美尼亚产）"
    },
    "ვანილი თურქული": {
        "en": "Vanilla, Turkish",
        "ru": "Ваниль, турецкая",
        "hy": "Վանիլին, թուրքական",
        "tr": "Vanilya, Türk",
        "zh": "香草（土耳其产）"
    },
    "ნიორი სუნელი სომხური": {
        "en": "Garlic Powder, Armenian",
        "ru": "Чесночная приправа, армянская",
        "hy": "Սխտորի համեմունք, հայկական",
        "tr": "Sarımsak Baharatı, Ermeni",
        "zh": "大蒜调料（亚美尼亚产）"
    },
    "კურკუმა სუნელი სომხური": {
        "en": "Turmeric, Armenian",
        "ru": "Куркума, армянская",
        "hy": "Քրքում, հայկական",
        "tr": "Zerdeçal, Ermeni",
        "zh": "姜黄（亚美尼亚产）"
    },
    "ქარი ინდური სუნელი სომხური ბრენდი კს რესურსი": {
        "en": "Curry Spice, Armenian Brand KS Resource",
        "ru": "Приправа карри, армянский бренд KS Resource",
        "hy": "Քարի համեմունք, հայկական ապրանքանիշ KS Resource",
        "tr": "Köri Baharatı, Ermeni Marka KS Resource",
        "zh": "咖喱调料（亚美尼亚品牌 KS Resource）"
    },
    "როზმარინი სომხური კს რესურსი": {
        "en": "Rosemary, Armenian, KS Resource",
        "ru": "Розмарин, армянский, KS Resource",
        "hy": "Խնկունի, հայկական, KS Resource",
        "tr": "Biberiye, Ermeni, KS Resource",
        "zh": "迷迭香（亚美尼亚产，KS Resource）"
    },
    "რეჰანი სუნელი სომხური კს რესურსი": {
        "en": "Basil, Armenian, KS Resource",
        "ru": "Базилик, армянский, KS Resource",
        "hy": "Ռեհան, հայկական, KS Resource",
        "tr": "Fesleğen, Ermeni, KS Resource",
        "zh": "罗勒（亚美尼亚产，KS Resource）"
    },
    "ბარბარისი მშრალი სომხური კს რესურსი": {
        "en": "Dried Barberry, Armenian, KS Resource",
        "ru": "Барбарис сушёный, армянский, KS Resource",
        "hy": "Չոր Բարբարիս, հայկական, KS Resource",
        "tr": "Kuru Diken Üzümü (Berberis), Ermeni, KS Resource",
        "zh": "干小檗果（亚美尼亚产，KS Resource）"
    },
    "შვრიის ფანტელი სოლნიშკო 0.5 კგ ": {
        "en": "Oat Flakes Solnyshko, 0.5kg",
        "ru": "Овсяные хлопья Солнышко, 0.5кг",
        "hy": "Վարսակի փաթիլներ Solnyshko, 0.5կգ",
        "tr": "Yulaf Ezmesi Solnyshko, 0.5kg",
        "zh": "燕麦片 Solnyshko（0.5公斤）"
    },
    "საპონი ხელის dalan ": {
        "en": "Hand Soap Dalan",
        "ru": "Мыло для рук Dalan",
        "hy": "Ձեռքի օճառ Dalan",
        "tr": "El Sabunu Dalan",
        "zh": "洗手皂 Dalan"
    }
};
