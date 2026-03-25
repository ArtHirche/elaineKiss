'use client';

import { useState, useEffect } from 'react';
import { cartService, CartItem } from '@/lib/firebase/cartService';

export function useCart(userId: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await cartService.getCartItems(userId);
      setCartItems(items);
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, price: number) => {
    try {
      setError(null);
      await cartService.addToCart(userId, productId, quantity, price);
      await fetchCartItems();
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);
      await cartService.updateCartItem(cartItemId, quantity);
      await fetchCartItems();
    } catch (err) {
      setError('Failed to update cart item');
      console.error('Error updating cart item:', err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      setError(null);
      await cartService.removeFromCart(cartItemId);
      await fetchCartItems();
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart(userId);
      setCartItems([]);
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: fetchCartItems,
  };
}
