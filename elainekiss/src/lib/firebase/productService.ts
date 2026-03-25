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
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class ProductService {
  private productsCollection = collection(db, 'products');

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const product: Omit<Product, 'id'> = {
      ...productData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(this.productsCollection, product);
    return docRef.id;
  }

  async updateProduct(productId: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  }

  async getProduct(productId: string): Promise<Product | null> {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product;
    }
    
    return null;
  }

  async getAllProducts(): Promise<Product[]> {
    const q = query(
      this.productsCollection,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const q = query(
      this.productsCollection,
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async updateStock(productId: string, newStock: number): Promise<void> {
    await this.updateProduct(productId, { stock: newStock });
  }

  async deactivateProduct(productId: string): Promise<void> {
    await this.updateProduct(productId, { isActive: false });
  }
}

export const productService = new ProductService();
