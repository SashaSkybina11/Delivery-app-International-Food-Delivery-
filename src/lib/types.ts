export type RatingRange = "all" | "4-5" | "3-4" | "2-3";
export type ProductSort = "default" | "price-asc" | "price-desc" | "name-asc";

export type Shop = {
  id: number;
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

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  shopId: number;
  shopName: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
};

export type Coupon = {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder: number;
  isActive: number;
};

export type CartItem = {
  productId: number;
  shopId: number;
  shopName: string;
  name: string;
  price: number;
  quantity: number;
  categoryName: string;
};

export type AppliedCoupon = {
  code: string;
  title: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder: number;
};

export type CatalogResponse = {
  shops: Shop[];
  selectedShopId: number | null;
  categories: Category[];
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
};

export type OrderHistoryItem = {
  productId: number;
  shopId: number;
  shopName: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderHistoryEntry = {
  id: string;
  email: string;
  phone: string;
  address: string;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  createdAt: string;
  items: OrderHistoryItem[];
};

export type OrderSearchResponse = {
  orders: OrderHistoryEntry[];
};
