"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

import styles from "@/components/layout/site-header.module.css";

const links = [
  { href: "/", label: "Shops" },
  { href: "/cart", label: "Cart" },
  { href: "/coupons", label: "Coupons" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>SS</span>
          <div>
            <p className={styles.brandTitle}>International Food Delivery</p>
            <p className={styles.brandSubtitle}>
              Spain and Ukraine in one delivery app
            </p>
          </div>
        </Link>

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                styles.link,
                pathname === link.href && styles.linkActive,
              )}
            >
              {link.label}
              {link.href === "/cart" && totalItems > 0 ? (
                <span className={styles.badge}>{totalItems}</span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
