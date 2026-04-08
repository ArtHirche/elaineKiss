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
  category: string;
  imageUrl?: string;
  fileName?: string;
  fileType?: string;
  stock?: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class ProductService {
  private productsCollection = collection(db, 'products');

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('productService: Creating product', productData);
    console.log('productService: Preparing timestamp...');
    const now = Timestamp.now();
    console.log('productService: Timestamp created:', now);
    
    const product: Omit<Product, 'id'> = {
      ...productData,
      createdAt: now,
      updatedAt: now,
    };
    
    console.log('productService: Product object prepared:', product);
    console.log('productService: Calling addDoc...');
    
    const docRef = await addDoc(this.productsCollection, product).catch(error => {
        console.error('productService: Erro no addDoc:', error);
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes completos:', JSON.stringify(error, null, 2));
        throw error;
    });
    
    console.log('productService: addDoc completed, ID:', docRef.id);
    return docRef.id;
  }

  async updateProduct(productId: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    console.log('productService: Updating product', productId, updates);
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log('productService: Product updated');
  }

  async deleteProduct(productId: string): Promise<void> {
    console.log('productService: Deleting product', productId);
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    console.log('productService: Product deleted');
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
    console.log('productService: Fetching all products');
    const q = query(
      this.productsCollection,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    console.log('productService: Products fetched:', products.length);
    return products;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    console.log('productService: Fetching products by category', category);
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

  async deactivateProduct(productId: string): Promise<void> {
    await this.updateProduct(productId, { isActive: false });
  }
}

export const productService = new ProductService();
