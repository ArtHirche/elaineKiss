'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

import Header from '../components/header';

import { Footer } from '../components/footer';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/cart/CartDrawer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthRoute = pathname && (pathname.startsWith('/login') || pathname.startsWith('/auth'));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {!isAuthRoute && <Header />}

          {!isAuthRoute && <div className="headerSpacer" />}

          {children}

          {!isAuthRoute && <Footer />}

          {!isAuthRoute && <CartDrawer />}
        </CartProvider>
      </body>
    </html>
  );
}
