railway
https://delivery-app-international-food-delivery-production.up.railway.app/ 

# International Food Delivery

Delivery app test task built with `Next.js`, `TypeScript`, `HTML/CSS`, `SQLite`, and `iziToast`.

## Project Overview

This project is a food delivery web application with an international concept.
The app includes **6 shops** from **Spain** and **Ukraine**:

- 🇪🇸 "La Paella"
- 🇪🇸 "El Toro Grill"
- 🇪🇸 "Dulce Vida"
- 🇺🇦 "Babusya Kitchen"
- 🇺🇦 "Kozak Grill"
- 🇺🇦 "Kyiv Sweets"

## Accomplished Tasks

### Base Level

- Shops page with products loaded from the database
- Shopping cart page
- Add products to cart
- Remove products from cart
- Change product quantity in cart
- Checkout form with `email`, `phone number`, and `address`
- Form validation before submission
- Order is saved to the database after clicking `Submit`

### Middle Level

- Responsive design for desktop, tablet, and mobile
- Product filtering by category
- Product sorting:
  - price ascending
  - price descending
  - alphabetical order (A → Z)
- Shop filtering by rating range

### Advanced Level

- Pagination for products on the shops page
- Coupons page
- Coupon application on the shopping cart page

## Additional Features

- International visual concept with abbreviation for shops
- Black, yellow, and white color palette
- Toast notifications with `iziToast`
- Relational SQLite database
- Seeded demo data for shops, products, and coupons

## Tech Stack

- Next.js App Router
- TypeScript
- HTML/CSS
- CSS Modules
- SQLite (`sqlite` + `sqlite3`)
- iziToast

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production

```bash
npm run build
npm run start
```

## Database

The app uses a relational SQLite database stored in `data/delivery-app.db`.
The database is initialized automatically on first run and seeded with demo shops, products, and coupons.
