'use client';

import { useState, useEffect } from 'react';
import { productService, Product } from '@/lib/firebase/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('useProducts: Fetching products...');
      setLoading(true);
      setError(null);
      const productsData = await productService.getAllProducts();
      console.log('useProducts: Products received:', productsData);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('useProducts: Creating product', productData);
      setError(null);
      await productService.createProduct(productData);
      console.log('useProducts: Product created, fetching products...');
      await fetchProducts();
      console.log('useProducts: Products fetched after create');
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    try {
      console.log('useProducts: Updating product', productId, updates);
      setError(null);
      await productService.updateProduct(productId, updates);
      console.log('useProducts: Product updated, fetching products...');
      await fetchProducts();
      console.log('useProducts: Products fetched after update');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      console.log('useProducts: Deleting product', productId);
      setError(null);
      await productService.deleteProduct(productId);
      console.log('useProducts: Product deleted, fetching products...');
      await fetchProducts();
      console.log('useProducts: Products fetched after delete');
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const getProduct = async (productId: string) => {
    try {
      setError(null);
      return await productService.getProduct(productId);
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
      return null;
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      setError(null);
      return await productService.getProductsByCategory(category);
    } catch (err) {
      setError('Failed to fetch products by category');
      console.error('Error fetching products by category:', err);
      return [];
    }
  };

  const searchProducts = async (searchTerm: string) => {
    try {
      setError(null);
      return await productService.searchProducts(searchTerm);
    } catch (err) {
      setError('Failed to search products');
      console.error('Error searching products:', err);
      return [];
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsByCategory,
    searchProducts,
    refetch: fetchProducts,
  };
}
