import type { Metadata } from "next";
import { Oswald, Quicksand } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/context/cart-context";

import "@/app/globals.css";
import "izitoast/dist/css/iziToast.min.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "International Food Delivery",
  description: "Food delivery app with shops from Spain and Ukraine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${quicksand.variable}`}>
        <CartProvider>
          <SiteHeader />
          <main className="app-shell">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
