import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBG594IJhYtAz1q4VZ0GJUnfUroUpgQHq4",
  authDomain: "elainekiss-4884f.firebaseapp.com",
  projectId: "elainekiss-4884f",
  storageBucket: "elainekiss-4884f.firebasestorage.app",
  messagingSenderId: "826611305764",
  appId: "1:826611305764:web:3ed1b6df1630f5bcb9b7b1",
};

console.log('Firebase config loaded');

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Testar conexão com Firestore
import { collection, getDocs, query, limit } from 'firebase/firestore';

// Teste de conexão assíncrono
const testFirestoreConnection = async () => {
  try {
    console.log('Testando conexão com Firestore...');
    const testQuery = query(collection(db, 'products'), limit(1));
    const snapshot = await getDocs(testQuery);
    console.log('✅ Firebase Firestore conectado com sucesso!');
    console.log('📋 Produtos existentes:', snapshot.size);
  } catch (error: any) {
    console.error('❌ Erro na conexão com Firebase Firestore:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
  }
};

// executar teste
testFirestoreConnection();
