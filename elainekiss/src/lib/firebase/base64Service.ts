export class Base64Service {
  async convertFileToBase64(file: File, maxWidth: number = 300): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validar tamanho antes de processar
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        reject(new Error('Arquivo muito grande. Máximo 2MB.'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calcular dimensões redimensionadas
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64 com qualidade reduzida
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); // Qualidade mais baixa
            
            // Validar tamanho do base64
            if (compressedBase64.length > 500000) { // ~500KB max
              // Se ainda muito grande, reduz mais
              const smallerCanvas = document.createElement('canvas');
              smallerCanvas.width = width * 0.7;
              smallerCanvas.height = height * 0.7;
              const smallerCtx = smallerCanvas.getContext('2d');
              
              if (smallerCtx) {
                smallerCtx.drawImage(img, 0, 0, width * 0.7, height * 0.7);
                const finalBase64 = smallerCanvas.toDataURL('image/jpeg', 0.4);
                console.log('base64Service: Imagem redimensionada 2x para reduzir tamanho');
                resolve(finalBase64);
                return;
              }
            }
            
            console.log('base64Service: Imagem otimizada, tamanho:', (compressedBase64.length / 1024).toFixed(1) + 'KB');
            resolve(compressedBase64);
          } else {
            reject(new Error('Não foi possível obter contexto do canvas'));
          }
        };
        
        img.onerror = () => {
          // Se falhar ao carregar imagem, usa FileReader direto
          const result = event.target?.result as string;
          console.log('base64Service: Usando conversão direta (fallback)');
          resolve(result);
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.onerror = (error) => {
        console.error('base64Service: Erro na leitura:', error);
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  }

  async uploadProductImage(file: File): Promise<string> {
    try {
      console.log('base64Service: Processando imagem:', file.name, 'Tamanho:', (file.size / 1024).toFixed(1) + 'KB');
      const optimizedBase64 = await this.convertFileToBase64(file);
      console.log('base64Service: Imagem processada com sucesso');
      return optimizedBase64;
    } catch (error) {
      console.error('base64Service: Erro ao processar imagem:', error);
      throw error;
    }
  }
}

export const base64Service = new Base64Service();
