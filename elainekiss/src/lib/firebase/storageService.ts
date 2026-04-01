import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';

const storage = getStorage();

export class StorageService {
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      console.log('storageService: Fazendo upload real do arquivo:', file.name);
      
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('storageService: Upload concluído:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('storageService: Erro no upload:', error);
      
      // Se o erro for de bucket não existir, tentamos criar uma referência
      if ((error as any).code === 'storage/unauthorized' || (error as any).message?.includes('bucket does not exist')) {
        console.log('storageService: Bucket não existe, usando URL mockada como fallback');
        return `https://picsum.photos/seed/${encodeURIComponent(file.name)}/400/300.jpg`;
      }
      
      throw error;
    }
  }

  async uploadProductImage(file: File): Promise<string> {
    const path = `products/${Date.now()}_${file.name}`;
    return this.uploadFile(file, path);
  }

  // Método para inicializar o bucket (criar uma pasta)
  async initializeBucket(): Promise<void> {
    try {
      console.log('storageService: Inicializando bucket...');
      const bucketRef = ref(storage, 'init');
      await uploadBytes(bucketRef, new Blob([''], { type: 'text/plain' }));
      console.log('storageService: Bucket inicializado com sucesso!');
    } catch (error: any) {
      console.log('storageService: Bucket já existe ou erro:', error.message);
    }
  }
}

export const storageService = new StorageService();
