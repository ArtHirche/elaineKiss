export class ImageService {
  async uploadProductImage(file: File): Promise<string> {
    try {
      console.log('imageService: Processando imagem:', file.name);
      
      // Criar uma URL única baseada no timestamp e nome do arquivo
      const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2);
      const imageUrl = `https://picsum.photos/seed/${uniqueId}-${encodeURIComponent(file.name)}/300/200.jpg`;
      
      console.log('imageService: URL gerada:', imageUrl);
      return imageUrl;
      
    } catch (error) {
      console.error('imageService: Erro, usando fallback:', error);
      return `https://picsum.photos/seed/fallback-${Date.now()}/300/200.jpg`;
    }
  }
}

export const imageService = new ImageService();
