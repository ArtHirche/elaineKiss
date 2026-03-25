import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CartItem {
  id?: string;
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class CartService {
  private cartsCollection = collection(db, 'carts');

  async addToCart(userId: string, productId: string, quantity: number, price: number): Promise<string> {
    const now = Timestamp.now();
    const cartItem: Omit<CartItem, 'id'> = {
      userId,
      productId,
      quantity,
      price,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(this.cartsCollection, cartItem);
    return docRef.id;
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<void> {
    const cartItemRef = doc(db, 'carts', cartItemId);
    await updateDoc(cartItemRef, {
      quantity,
      updatedAt: Timestamp.now(),
    });
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    const cartItemRef = doc(db, 'carts', cartItemId);
    await deleteDoc(cartItemRef);
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const q = query(
      this.cartsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CartItem[];
  }

  async getCartItem(cartItemId: string): Promise<CartItem | null> {
    const cartItemRef = doc(db, 'carts', cartItemId);
    const cartItemSnap = await getDoc(cartItemRef);
    
    if (cartItemSnap.exists()) {
      return {
        id: cartItemSnap.id,
        ...cartItemSnap.data()
      } as CartItem;
    }
    
    return null;
  }

  async clearCart(userId: string): Promise<void> {
    const cartItems = await this.getCartItems(userId);
    const deletePromises = cartItems.map(item => this.removeFromCart(item.id!));
    await Promise.all(deletePromises);
  }
}

export const cartService = new CartService();
