'use client';

import { useState, useEffect } from 'react';
import { categoryService, Category } from '@/lib/firebase/categoryService';
import { categorias as defaultCategorias } from '@/data/categorias';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    // Initial state setup: Map static array to matching interface structure
    return defaultCategorias.map(item => ({
      id: `static-${item.slug}`,
      name: item.nome,
      slug: item.slug,
      description: `Categoria ${item.nome}`,
      isActive: true,
    }));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('useCategories: Fetching categories from Firestore...');
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      console.log('useCategories: Categories received:', data);
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, description: string = "", isActive: boolean = true) => {
    try {
      console.log('useCategories: Creating category', name);
      setError(null);
      await categoryService.createCategory(name, description, isActive);
      console.log('useCategories: Category created, reloading list...');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (categoryId: string, updates: { name?: string; description?: string; isActive?: boolean }) => {
    try {
      console.log('useCategories: Updating category', categoryId, updates);
      setError(null);
      await categoryService.updateCategory(categoryId, updates);
      console.log('useCategories: Category updated, reloading list...');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      console.log('useCategories: Deleting category', categoryId);
      setError(null);
      await categoryService.deleteCategory(categoryId);
      console.log('useCategories: Category deleted, reloading list...');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
