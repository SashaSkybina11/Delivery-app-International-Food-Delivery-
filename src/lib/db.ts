import path from "node:path";
import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

import { seedCategories, seedCoupons, seedProducts, seedShops } from "@/lib/seed";
import {
  CatalogResponse,
  Category,
  Coupon,
  OrderHistoryEntry,
  OrderHistoryItem,
  Product,
  ProductSort,
  RatingRange,
  Shop,
} from "@/lib/types";

declare global {
  var __deliveryDbPromise: Promise<Database> | undefined;
}

const DB_PATH = path.join(process.cwd(), "data", "delivery-app.db");
const PAGE_SIZE = 9;

function getRatingBounds(range: RatingRange) {
  switch (range) {
    case "4-5":
      return [4, 5];
    case "3-4":
      return [3, 4];
    case "2-3":
      return [2, 3];
    default:
      return null;
  }
}

function getSortSql(sort: ProductSort) {
  switch (sort) {
    case "price-asc":
      return "p.price ASC, p.name ASC";
    case "price-desc":
      return "p.price DESC, p.name ASC";
    case "name-asc":
      return "p.name ASC";
    default:
      return "p.id ASC";
  }
}

async function seedDatabase(db: Database) {
  for (const shop of seedShops) {
    await db.run(
      `INSERT INTO shops (name, slug, country, flag, description, rating, delivery_time, delivery_fee, accent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shop.name,
        shop.slug,
        shop.country,
        shop.flag,
        shop.description,
        shop.rating,
        shop.deliveryTime,
        shop.deliveryFee,
        shop.accent,
      ],
    );
  }

  for (const category of seedCategories) {
    await db.run(`INSERT INTO categories (name) VALUES (?)`, [category.name]);
  }

  const shopRows = await db.all<{ id: number; slug: string }[]>(`SELECT id, slug FROM shops`);
  const categoryRows = await db.all<{ id: number; name: string }[]>(
    `SELECT id, name FROM categories`,
  );

  const shopBySlug = new Map(shopRows.map((shop) => [shop.slug, shop.id]));
  const categoryByName = new Map(categoryRows.map((category) => [category.name, category.id]));

  for (const product of seedProducts) {
    await db.run(
      `INSERT INTO products (shop_id, category_id, name, description, price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        shopBySlug.get(product.shopSlug),
        categoryByName.get(product.categoryName),
        product.name,
        product.description,
        product.price,
      ],
    );
  }

  for (const coupon of seedCoupons) {
    await db.run(
      `INSERT INTO coupons (code, title, description, discount_type, discount_value, min_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        coupon.code,
        coupon.title,
        coupon.description,
        coupon.discountType,
        coupon.discountValue,
        coupon.minOrder,
      ],
    );
  }
}

async function syncSeedShops(db: Database) {
  for (const shop of seedShops) {
    await db.run(
      `UPDATE shops
       SET name = ?, country = ?, flag = ?, description = ?, rating = ?, delivery_time = ?, delivery_fee = ?, accent = ?
       WHERE slug = ?`,
      [
        shop.name,
        shop.country,
        shop.flag,
        shop.description,
        shop.rating,
        shop.deliveryTime,
        shop.deliveryFee,
        shop.accent,
        shop.slug,
      ],
    );
  }
}

async function initializeDatabase(db: Database) {
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      country TEXT NOT NULL DEFAULT '',
      flag TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      rating REAL NOT NULL,
      delivery_time TEXT NOT NULL,
      delivery_fee REAL NOT NULL,
      accent TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (shop_id) REFERENCES shops (id),
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
      discount_value REAL NOT NULL,
      min_order REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL,
      total REAL NOT NULL,
      coupon_code TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      shop_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (shop_id) REFERENCES shops (id)
    );
  `);

  const columns = await db.all<Array<{ name: string }>>(`PRAGMA table_info(shops)`);
  const hasCountry = columns.some((column) => column.name === "country");
  const hasFlag = columns.some((column) => column.name === "flag");

  if (!hasCountry) {
    await db.exec(`ALTER TABLE shops ADD COLUMN country TEXT NOT NULL DEFAULT ''`);
  }

  if (!hasFlag) {
    await db.exec(`ALTER TABLE shops ADD COLUMN flag TEXT NOT NULL DEFAULT ''`);
  }

  const existingShops = await db.all<Array<{ slug: string }>>(
    `SELECT slug FROM shops ORDER BY slug ASC`,
  );
  const expectedSlugs = seedShops.map((shop) => shop.slug).sort();
  const needsReseed =
    existingShops.length !== expectedSlugs.length ||
    existingShops.some((shop, index) => shop.slug !== expectedSlugs[index]);

  if (needsReseed) {
    await db.exec(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM coupons;
      DELETE FROM shops;
    `);
    await seedDatabase(db);
  } else {
    await syncSeedShops(db);
  }
}

export async function getDb() {
  if (!global.__deliveryDbPromise) {
    global.__deliveryDbPromise = open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    }).then(async (db) => {
      await initializeDatabase(db);
      return db;
    });
  }

  return global.__deliveryDbPromise;
}

export async function getCoupons() {
  const db = await getDb();
  return db.all<Coupon[]>(
    `SELECT id, code, title, description, discount_type as discountType, discount_value as discountValue,
            min_order as minOrder, is_active as isActive
     FROM coupons
     WHERE is_active = 1
     ORDER BY id ASC`,
  );
}

export async function getCouponByCode(code: string) {
  const db = await getDb();
  return db.get<Coupon>(
    `SELECT id, code, title, description, discount_type as discountType, discount_value as discountValue,
            min_order as minOrder, is_active as isActive
     FROM coupons
     WHERE UPPER(code) = UPPER(?) AND is_active = 1`,
    [code],
  );
}

export async function getCatalog(params: {
  ratingRange?: RatingRange;
  shopId?: number | null;
  categoryIds?: number[];
  sort?: ProductSort;
  page?: number;
}): Promise<CatalogResponse> {
  const db = await getDb();
  const ratingRange = params.ratingRange ?? "all";
  const sort = params.sort ?? "default";
  const page = Math.max(1, params.page ?? 1);
  const categoryIds = params.categoryIds ?? [];
  const ratingBounds = getRatingBounds(ratingRange);

  let shopsSql = `
    SELECT id, name, slug, country, flag, description, rating, delivery_time as deliveryTime,
           delivery_fee as deliveryFee, accent
    FROM shops
  `;
  const shopWhere: string[] = [];
  const shopArgs: Array<string | number> = [];

  if (ratingBounds) {
    shopWhere.push(`rating >= ? AND rating <= ?`);
    shopArgs.push(ratingBounds[0], ratingBounds[1]);
  }

  if (shopWhere.length > 0) {
    shopsSql += ` WHERE ${shopWhere.join(" AND ")}`;
  }

  shopsSql += ` ORDER BY rating DESC, name ASC`;

  const shops = await db.all<Shop[]>(shopsSql, shopArgs);
  const selectedShopId = shops.find((shop) => shop.id === params.shopId)?.id ?? shops[0]?.id ?? null;

  if (!selectedShopId) {
    return {
      shops,
      selectedShopId: null,
      categories: [],
      products: [],
      totalProducts: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const categories = await db.all<Category[]>(
    `SELECT DISTINCT c.id, c.name
     FROM categories c
     INNER JOIN products p ON p.category_id = c.id
     WHERE p.shop_id = ?
     ORDER BY c.name ASC`,
    [selectedShopId],
  );

  const productWhere = [`p.shop_id = ?`];
  const productArgs: Array<number | string> = [selectedShopId];

  if (categoryIds.length > 0) {
    const placeholders = categoryIds.map(() => "?").join(", ");
    productWhere.push(`p.category_id IN (${placeholders})`);
    productArgs.push(...categoryIds);
  }

  const whereClause = `WHERE ${productWhere.join(" AND ")}`;
  const countRow =
    (await db.get<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM products p
       ${whereClause}`,
      productArgs,
    )) ?? { count: 0 };

  const totalProducts = countRow.count;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;

  const products = await db.all<Product[]>(
    `SELECT p.id, p.shop_id as shopId, s.name as shopName, p.name, p.description, p.price,
            c.id as categoryId, c.name as categoryName
     FROM products p
     INNER JOIN shops s ON s.id = p.shop_id
     INNER JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY ${getSortSql(sort)}
     LIMIT ${PAGE_SIZE} OFFSET ?`,
    [...productArgs, offset],
  );

  return {
    shops,
    selectedShopId,
    categories,
    products,
    totalProducts,
    totalPages,
    currentPage: safePage,
  };
}

export async function createOrder(input: {
  email: string;
  phone: string;
  address: string;
  couponCode?: string;
  items: Array<{ productId: number; quantity: number }>;
}) {
  const db = await getDb();
  const productIds = input.items.map((item) => item.productId);
  const placeholders = productIds.map(() => "?").join(", ");

  const products = productIds.length
    ? await db.all<
        Array<{
          id: number;
          shopId: number;
          shopName: string;
          name: string;
          price: number;
        }>
      >(
        `SELECT p.id, p.shop_id as shopId, s.name as shopName, p.name, p.price
         FROM products p
         INNER JOIN shops s ON s.id = p.shop_id
         WHERE p.id IN (${placeholders})`,
        productIds,
      )
    : [];

  const productMap = new Map(products.map((product) => [product.id, product]));
  const normalizedItems = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} was not found.`);
    }

    return {
      ...item,
      ...product,
      lineTotal: Number((product.price * item.quantity).toFixed(2)),
    };
  });

  const subtotal = Number(
    normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );

  let couponCode: string | null = null;
  let discount = 0;
  if (input.couponCode) {
    const coupon = await getCouponByCode(input.couponCode);
    if (!coupon) {
      throw new Error("Coupon code is invalid.");
    }

    if (subtotal < coupon.minOrder) {
      throw new Error(`Coupon requires a minimum order of ${coupon.minOrder} EUR.`);
    }

    couponCode = coupon.code;
    discount =
      coupon.discountType === "percent"
        ? Number(((subtotal * coupon.discountValue) / 100).toFixed(2))
        : Math.min(subtotal, coupon.discountValue);
  }

  const total = Number(Math.max(0, subtotal - discount).toFixed(2));
  const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(
    100 + Math.random() * 900,
  )}`;

  await db.run("BEGIN TRANSACTION");

  try {
    await db.run(
      `INSERT INTO orders (id, email, phone, address, subtotal, discount, total, coupon_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, input.email, input.phone, input.address, subtotal, discount, total, couponCode],
    );

    for (const item of normalizedItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, shop_id, product_name, product_price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.shopId, item.name, item.price, item.quantity],
      );
    }

    await db.run("COMMIT");
  } catch (error) {
    await db.run("ROLLBACK");
    throw error;
  }

  return {
    orderId,
    subtotal,
    discount,
    total,
    couponCode,
  };
}

export async function searchOrders(params: {
  email?: string;
  phone?: string;
  orderId?: string;
}) {
  const db = await getDb();
  const orderWhere: string[] = [];
  const orderArgs: Array<string> = [];

  if (params.orderId) {
    orderWhere.push(`o.id = ?`);
    orderArgs.push(params.orderId);
  } else {
    if (params.email) {
      orderWhere.push(`LOWER(o.email) = LOWER(?)`);
      orderArgs.push(params.email);
    }
    if (params.phone) {
      orderWhere.push(`o.phone = ?`);
      orderArgs.push(params.phone);
    }
  }

  const orders = await db.all<
    Array<{
      id: string;
      email: string;
      phone: string;
      address: string;
      subtotal: number;
      discount: number;
      total: number;
      couponCode: string | null;
      createdAt: string;
    }>
  >(
    `SELECT o.id, o.email, o.phone, o.address, o.subtotal, o.discount, o.total,
            o.coupon_code as couponCode, o.created_at as createdAt
     FROM orders o
     ${orderWhere.length ? `WHERE ${orderWhere.join(" AND ")}` : ""}
     ORDER BY o.created_at DESC`,
    orderArgs,
  );

  const results: OrderHistoryEntry[] = [];

  for (const order of orders) {
    const items = await db.all<OrderHistoryItem[]>(
      `SELECT oi.product_id as productId, oi.shop_id as shopId, s.name as shopName,
              oi.product_name as name, oi.product_price as price, oi.quantity
       FROM order_items oi
       INNER JOIN shops s ON s.id = oi.shop_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [order.id],
    );

    results.push({
      ...order,
      items,
    });
  }

  return results;
}
