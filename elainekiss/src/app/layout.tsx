'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

import Header from '../components/header';

import { Footer } from '../components/footer';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/cart/CartDrawer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import AuthProvider from '../components/auth/AuthProvider';

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
  const isAuthRoute = pathname && (pathname.startsWith('/login') || pathname.startsWith('/cadastro') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password'));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {!isAuthRoute && <Header />}

            {!isAuthRoute && <div className="headerSpacer" />}

            {children}

            {!isAuthRoute && <Footer />}

            {!isAuthRoute && <CartDrawer />}

            {!isAuthRoute && <WhatsAppFloat />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
