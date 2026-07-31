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

import { SiteLayoutProvider } from '../context/SiteLayoutContext';
import InlineFrontEditorToolbar from '../components/admin/InlineFrontEditorToolbar';

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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SiteLayoutProvider>
            <CartProvider>
              {!isAuthRoute && <Header />}

              {!isAuthRoute && <div className="headerSpacer" />}

              {children}

              {!isAuthRoute && <Footer />}

              {!isAuthRoute && <CartDrawer />}

              {!isAuthRoute && <WhatsAppFloat />}

              <InlineFrontEditorToolbar />
            </CartProvider>
          </SiteLayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
