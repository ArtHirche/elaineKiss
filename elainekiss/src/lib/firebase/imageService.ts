export class ImageService {
  async uploadProductImage(file: File): Promise<string> {
    try {
      console.log('imageService: Processando imagem local:', file.name);
      
      // Converter o arquivo para data URL (base64) - funciona offline e sem autenticação
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && result.startsWith('data:')) {
            console.log('imageService: Imagem convertida para data URL:', result.substring(0, 50) + '...');
            resolve(result);
          } else {
            reject(new Error('Falha ao converter imagem para data URL'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Erro ao ler o arquivo'));
        };
        
        reader.readAsDataURL(file);
      });
      
    } catch (error) {
      console.error('imageService: Erro no processamento da imagem:', error);
      // Fallback para Picsum apenas em caso de erro real
      const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2);
      return `https://picsum.photos/seed/error-${uniqueId}/300/200.jpg`;
    }
  }
}

export const imageService = new ImageService();
