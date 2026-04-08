/**
 * Utilitário para tratamento de imagens com suporte a Base64 persistente
 * Funciona localmente sem CORS e sem dependências externas
 */

export const getImageSrc = (imageUrl?: string): string => {
    if (!imageUrl) return "/produtos/default.jpg";

    // Se já for Base64 (começa com data:), retorna como está
    if (imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    // Se for URL HTTP/HTTPS ou blob, retorna como está
    if (imageUrl.startsWith("http") || imageUrl.startsWith("blob:")) {
        return imageUrl;
    }

    // Se for caminho relativo, adiciona a barra inicial
    return `/${imageUrl}`;
};

/**
 * Verifica se uma imagem é Base64
 */
export const isBase64Image = (imageUrl?: string): boolean => {
    return imageUrl ? imageUrl.startsWith("data:") : false;
};

/**
 * Extrai informações do arquivo Base64
 */
export const getBase64FileInfo = (base64String: string) => {
    const matches = base64String.match(/^data:(.+?);base64,(.+)$/);
    if (!matches) return null;
    
    return {
        mimeType: matches[1],
        data: matches[2],
        size: Math.round((base64String.length * 3) / 4) // Tamanho aproximado em bytes
    };
};
