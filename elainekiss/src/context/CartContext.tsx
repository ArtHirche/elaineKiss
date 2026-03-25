"use client";

import { createContext, useContext, useState } from "react";
import { useCart as useFirebaseCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

type CartContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  cartItems: any[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number, price: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid || null;

  const {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useFirebaseCart(userId || "guest-user");

  return (
    <CartContext.Provider
      value={{
        open,
        setOpen,
        cartItems,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
