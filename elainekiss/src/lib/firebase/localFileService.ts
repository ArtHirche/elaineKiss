export class LocalFileService {
  async uploadFile(file: File): Promise<string> {
    try {
      console.log('localFileService: Criando URL local para o arquivo:', file.name);
      
      // Criar URL temporária para o arquivo local
      const localUrl = URL.createObjectURL(file);
      console.log('localFileService: URL local criada:', localUrl);
      
      // Salvar o arquivo em uma pasta temporária para acesso posterior
      return localUrl;
    } catch (error) {
      console.error('localFileService: Erro ao criar URL local:', error);
      throw error;
    }
  }

  async uploadProductImage(file: File): Promise<string> {
    return this.uploadFile(file);
  }
}

export const localFileService = new LocalFileService();
