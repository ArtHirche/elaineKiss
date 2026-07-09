import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { categorias as defaultCategorias } from '@/data/categorias';

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export class CategoryService {
  private categoriesCollection = collection(db, 'categories');

  async getAllCategories(): Promise<Category[]> {
    console.log('categoryService: Fetching all categories');
    try {
      const q = query(this.categoriesCollection, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      let categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });

      // Se a coleção estiver vazia no Firestore, vamos inicializá-la (seeding)
      if (categories.length === 0) {
        console.log('categoryService: No categories found in Firestore, seeding default categories...');
        const batch = writeBatch(db);
        const seededCategories: Category[] = [];
        
        const now = Timestamp.now();
        for (const item of defaultCategorias) {
          const slug = generateSlug(item.nome);
          const newCatRef = doc(this.categoriesCollection); // auto-generate ID
          const catData = {
            name: item.nome,
            slug: slug,
            description: `Categoria ${item.nome}`,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          };
          batch.set(newCatRef, catData);
          seededCategories.push({
            id: newCatRef.id,
            ...catData
          });
        }

        await batch.commit();
        console.log(`categoryService: Successfully seeded ${seededCategories.length} categories.`);
        categories = seededCategories;
      }

      return categories;
    } catch (error) {
      console.error('categoryService: Error getting categories, using fallback static data:', error);
      // Fallback a partir de defaultCategorias se Firestore falhar
      const now = Timestamp.now();
      return defaultCategorias.map(item => ({
        id: `static-${item.slug}`,
        name: item.nome,
        slug: item.slug,
        description: `Categoria ${item.nome}`,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }));
    }
  }

  async createCategory(name: string, description: string = "", isActive: boolean = true): Promise<string> {
    console.log('categoryService: Creating category', name);
    const now = Timestamp.now();
    const slug = generateSlug(name);
    
    // Verificar se já existe categoria com esse nome
    const q = query(this.categoriesCollection, where('name', '==', name));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error(`A categoria "${name}" já existe.`);
    }

    const catData: Omit<Category, 'id'> = {
      name,
      slug,
      description,
      isActive,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(this.categoriesCollection, catData);
    console.log('categoryService: Category created with ID:', docRef.id);
    return docRef.id;
  }

  async updateCategory(categoryId: string, updates: { name?: string; description?: string; isActive?: boolean }): Promise<void> {
    console.log('categoryService: Updating category', categoryId, updates);
    const categoryRef = doc(db, 'categories', categoryId);
    
    const updatedData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    if (updates.name) {
      updatedData.slug = generateSlug(updates.name);
    }
    
    await updateDoc(categoryRef, updatedData);
    console.log('categoryService: Category updated successfully');
  }

  async deleteCategory(categoryId: string): Promise<void> {
    console.log('categoryService: Deleting category', categoryId);
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
    console.log('categoryService: Category deleted successfully');
  }
}

export const categoryService = new CategoryService();
