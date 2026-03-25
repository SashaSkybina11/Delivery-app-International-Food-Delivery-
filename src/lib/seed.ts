type SeedShop = {
  name: string;
  slug: string;
  country: string;
  flag: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  accent: string;
};

type SeedCategory = {
  name: string;
};

type SeedProduct = {
  shopSlug: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
};

type SeedCoupon = {
  code: string;
  title: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder: number;
};

export const seedShops: SeedShop[] = [
  {
    name: "La Paella",
    slug: "la-paella",
    country: "Spain",
    flag: "🇪🇸",
    description: "Spanish rice specials with seafood, saffron, and bright Mediterranean flavors.",
    rating: 4.9,
    deliveryTime: "25-35 min",
    deliveryFee: 3.8,
    accent: "gold",
  },
  {
    name: "El Toro Grill",
    slug: "el-toro-grill",
    country: "Spain",
    flag: "🇪🇸",
    description: "Charcoal grill house with tapas, steak plates, and smoky sides.",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: 4.2,
    accent: "onyx",
  },
  {
    name: "Dulce Vida",
    slug: "dulce-vida",
    country: "Spain",
    flag: "🇪🇸",
    description: "Spanish dessert studio with churros, crema catalana, and sweet drinks.",
    rating: 3.2,
    deliveryTime: "15-25 min",
    deliveryFee: 2.6,
    accent: "linen",
  },
  {
    name: "Babusya Kitchen",
    slug: "babusya-kitchen",
    country: "Ukraine",
    flag: "🇺🇦",
    description: "Warm homemade Ukrainian comfort food, soups, dumplings, and family classics.",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: 3.2,
    accent: "gold",
  },
  {
    name: "Kozak Grill",
    slug: "kozak-grill",
    country: "Ukraine",
    flag: "🇺🇦",
    description: "Bold grilled meats, potatoes, and street food inspired by Ukrainian favorites.",
    rating: 4.3,
    deliveryTime: "20-30 min",
    deliveryFee: 3.7,
    accent: "onyx",
  },
  {
    name: "Kyiv Sweets",
    slug: "kyiv-sweets",
    country: "Ukraine",
    flag: "🇺🇦",
    description: "Desserts, pastries, and sweet boxes inspired by modern Kyiv cafes.",
    rating: 4.1,
    deliveryTime: "15-25 min",
    deliveryFee: 2.4,
    accent: "linen",
  },
];

export const seedCategories: SeedCategory[] = [
  { name: "Rice" },
  { name: "Grill" },
  { name: "Desserts" },
  { name: "Drinks" },
  { name: "Home Food" },
  { name: "Pastries" },
];

export const seedProducts: SeedProduct[] = [
  { shopSlug: "la-paella", categoryName: "Rice", name: "Seafood Paella", description: "Saffron rice with mussels, shrimp, and lemon.", price: 18.5 },
  { shopSlug: "la-paella", categoryName: "Rice", name: "Chicken Paella", description: "Spanish rice with chicken, beans, and smoked paprika.", price: 15.4 },
  { shopSlug: "la-paella", categoryName: "Rice", name: "Vegetable Paella", description: "Seasonal vegetables, peas, peppers, and olive oil.", price: 14.2 },
  { shopSlug: "la-paella", categoryName: "Rice", name: "Black Rice Pot", description: "Squid ink rice with garlic aioli.", price: 17.9 },
  { shopSlug: "la-paella", categoryName: "Drinks", name: "Citrus Sangria Mocktail", description: "Orange, grape, and sparkling soda.", price: 4.8 },
  { shopSlug: "la-paella", categoryName: "Drinks", name: "Lemon Tonic", description: "Sharp sparkling tonic with lemon peel.", price: 3.9 },
  { shopSlug: "la-paella", categoryName: "Desserts", name: "Basque Cheesecake", description: "Creamy cheesecake with caramelized top.", price: 6.4 },
  { shopSlug: "la-paella", categoryName: "Desserts", name: "Orange Flan", description: "Classic custard with orange zest.", price: 5.7 },
  { shopSlug: "la-paella", categoryName: "Rice", name: "Chorizo Rice Skillet", description: "Paella rice with chorizo and roasted peppers.", price: 16.8 },
  { shopSlug: "la-paella", categoryName: "Desserts", name: "Almond Tarta", description: "Light almond cake with powdered sugar.", price: 5.9 },

  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Toro Steak Plate", description: "Grilled beef steak with roasted potatoes.", price: 19.6 },
  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Chicken Pinchos", description: "Spanish chicken skewers with garlic herbs.", price: 14.1 },
  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Iberico Burger", description: "Juicy pork burger with smoked cheese.", price: 13.8 },
  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Tapas Grill Mix", description: "Mini sausages, peppers, mushrooms, and bread.", price: 16.3 },
  { shopSlug: "el-toro-grill", categoryName: "Drinks", name: "Sparkling Lemon", description: "Fresh lemon soda with mint.", price: 3.7 },
  { shopSlug: "el-toro-grill", categoryName: "Drinks", name: "Iced Espresso", description: "Strong espresso on ice.", price: 3.9 },
  { shopSlug: "el-toro-grill", categoryName: "Desserts", name: "Churros Dip Box", description: "Crisp churros with dark chocolate dip.", price: 5.8 },
  { shopSlug: "el-toro-grill", categoryName: "Desserts", name: "Vanilla Crema Cup", description: "Spanish vanilla cream with cinnamon.", price: 4.9 },
  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Lamb Skewer Duo", description: "Two skewers with onion and grill sauce.", price: 17.2 },
  { shopSlug: "el-toro-grill", categoryName: "Grill", name: "Patatas Bravas Tray", description: "Crisp potatoes with spicy tomato sauce.", price: 8.4 },

  { shopSlug: "dulce-vida", categoryName: "Desserts", name: "Classic Churros", description: "Warm churros rolled in sugar.", price: 4.8 },
  { shopSlug: "dulce-vida", categoryName: "Desserts", name: "Crema Catalana", description: "Silky vanilla custard with burnt sugar crust.", price: 6.1 },
  { shopSlug: "dulce-vida", categoryName: "Desserts", name: "Chocolate Tarta", description: "Dense chocolate tart with cocoa glaze.", price: 6.3 },
  { shopSlug: "dulce-vida", categoryName: "Pastries", name: "Ensaimada", description: "Soft spiral pastry dusted with sugar.", price: 4.5 },
  { shopSlug: "dulce-vida", categoryName: "Pastries", name: "Lemon Brioche", description: "Light brioche with lemon cream.", price: 4.9 },
  { shopSlug: "dulce-vida", categoryName: "Drinks", name: "Iced Horchata", description: "Sweet rice drink with cinnamon.", price: 4.1 },
  { shopSlug: "dulce-vida", categoryName: "Drinks", name: "Hot Cocoa", description: "Rich dark chocolate drink.", price: 4.4 },
  { shopSlug: "dulce-vida", categoryName: "Desserts", name: "Burnt Cheesecake Slice", description: "Creamy cheesecake with caramel edges.", price: 5.9 },
  { shopSlug: "dulce-vida", categoryName: "Desserts", name: "Caramel Almond Bar", description: "Crunchy almond bar with caramel finish.", price: 4.6 },
  { shopSlug: "dulce-vida", categoryName: "Pastries", name: "Cream Puff Box", description: "Three puffs filled with vanilla cream.", price: 5.7 },

  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Chicken Kyiv Plate", description: "Crisp chicken cutlet with mashed potatoes.", price: 15.6 },
  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Borshch Bowl", description: "Beet soup with sour cream and herbs.", price: 8.6 },
  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Varenyky with Potato", description: "Tender dumplings with onion butter.", price: 11.2 },
  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Holubtsi", description: "Stuffed cabbage rolls in tomato sauce.", price: 12.8 },
  { shopSlug: "babusya-kitchen", categoryName: "Drinks", name: "Berry Uzvar", description: "Traditional fruit drink served chilled.", price: 3.5 },
  { shopSlug: "babusya-kitchen", categoryName: "Drinks", name: "Honey Lemon Tea", description: "Black tea with honey and lemon.", price: 3.7 },
  { shopSlug: "babusya-kitchen", categoryName: "Desserts", name: "Syrnyky", description: "Cheese pancakes with berry jam.", price: 6.4 },
  { shopSlug: "babusya-kitchen", categoryName: "Desserts", name: "Medivnyk Slice", description: "Soft honey cake with cream layers.", price: 5.9 },
  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Buckwheat Cutlet Plate", description: "Buckwheat, mushroom cutlet, and pickles.", price: 10.9 },
  { shopSlug: "babusya-kitchen", categoryName: "Home Food", name: "Deruny Stack", description: "Potato pancakes with garlic sour cream.", price: 9.8 },

  { shopSlug: "kozak-grill", categoryName: "Grill", name: "Pork Shashlik", description: "Marinated pork skewers with grilled onion.", price: 16.7 },
  { shopSlug: "kozak-grill", categoryName: "Grill", name: "Chicken Shashlik", description: "Tender chicken skewers with herbs.", price: 14.2 },
  { shopSlug: "kozak-grill", categoryName: "Grill", name: "Kozak Burger", description: "Beef burger with smoked sauce and pickles.", price: 12.9 },
  { shopSlug: "kozak-grill", categoryName: "Grill", name: "Sausage Board", description: "Grilled sausages with mustard and slaw.", price: 15.1 },
  { shopSlug: "kozak-grill", categoryName: "Home Food", name: "Roasted Potato Pan", description: "Potatoes with garlic, dill, and mushrooms.", price: 8.8 },
  { shopSlug: "kozak-grill", categoryName: "Home Food", name: "Cabbage Salad", description: "Fresh cabbage salad with sunflower oil.", price: 4.1 },
  { shopSlug: "kozak-grill", categoryName: "Drinks", name: "Apple Compote", description: "House fruit drink with apple and pear.", price: 3.3 },
  { shopSlug: "kozak-grill", categoryName: "Drinks", name: "Kvass Glass", description: "Traditional bread-based refreshing drink.", price: 3.6 },
  { shopSlug: "kozak-grill", categoryName: "Desserts", name: "Cherry Nalysnyky", description: "Sweet crepes with cherry filling.", price: 5.8 },
  { shopSlug: "kozak-grill", categoryName: "Grill", name: "Beef Rib Plate", description: "Slow grilled ribs with baked potato wedges.", price: 18.4 },

  { shopSlug: "kyiv-sweets", categoryName: "Desserts", name: "Kyiv Cake Slice", description: "Nut meringue layers with butter cream.", price: 6.5 },
  { shopSlug: "kyiv-sweets", categoryName: "Desserts", name: "Poppy Seed Roll", description: "Sweet roll packed with poppy filling.", price: 4.8 },
  { shopSlug: "kyiv-sweets", categoryName: "Desserts", name: "Chocolate Cherry Cup", description: "Layered cherry dessert with dark chocolate.", price: 5.4 },
  { shopSlug: "kyiv-sweets", categoryName: "Pastries", name: "Apple Pirozhok", description: "Soft pastry with cinnamon apple filling.", price: 4.2 },
  { shopSlug: "kyiv-sweets", categoryName: "Pastries", name: "Vanilla Bun", description: "Fluffy bun with vanilla custard.", price: 4.1 },
  { shopSlug: "kyiv-sweets", categoryName: "Drinks", name: "Raf Coffee", description: "Creamy coffee with vanilla foam.", price: 4.7 },
  { shopSlug: "kyiv-sweets", categoryName: "Drinks", name: "Sea Buckthorn Tea", description: "Bright tea with berries and honey.", price: 4.2 },
  { shopSlug: "kyiv-sweets", categoryName: "Desserts", name: "Napoleon Square", description: "Crisp layered pastry with cream.", price: 5.7 },
  { shopSlug: "kyiv-sweets", categoryName: "Desserts", name: "Honey Walnut Tart", description: "Tart shell with honey and walnut filling.", price: 5.9 },
  { shopSlug: "kyiv-sweets", categoryName: "Pastries", name: "Mini Eclair Box", description: "Three small eclairs with vanilla cream.", price: 6.2 },
];

export const seedCoupons: SeedCoupon[] = [
  {
    code: "SAVE10",
    title: "10% off your order",
    description: "Works for any international order above 20 EUR.",
    discountType: "percent",
    discountValue: 10,
    minOrder: 20,
  },
  {
    code: "PASTA5",
    title: "5 EUR off dinner",
    description: "Flat 5 EUR discount for baskets above 30 EUR.",
    discountType: "fixed",
    discountValue: 5,
    minOrder: 30,
  },
  {
    code: "SWEET15",
    title: "15% dessert treat",
    description: "Dessert lovers can save 15% for baskets over 18 EUR.",
    discountType: "percent",
    discountValue: 15,
    minOrder: 18,
  },
];
