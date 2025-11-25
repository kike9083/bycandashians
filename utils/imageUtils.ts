
export const getOptimizedImageUrl = (url: string, width: number = 800): string => {
  if (!url) return '';

  // 1. Si es una imagen Base64 (Generada por la IA), devolver tal cual
  if (url.startsWith('data:')) {
    return url;
  }

  // 2. Optimización Nativa para Unsplash
  // Unsplash permite redimensionamiento dinámico vía parámetros URL
  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    let newUrl = url;
    
    // Si ya tiene w=, lo reemplazamos, si no, lo agregamos
    if (newUrl.includes('w=')) {
        newUrl = newUrl.replace(/w=\d+/, `w=${width}`);
    } else {
        newUrl = `${newUrl}${separator}w=${width}`;
    }
    
    if (!newUrl.includes('q=')) newUrl += '&q=80';
    if (!newUrl.includes('auto=format')) newUrl += '&auto=format';
    if (!newUrl.includes('fit=')) newUrl += '&fit=crop';
    
    return newUrl;
  }

  // 3. Optimización para MinIO / Supabase / URLs Externas
  // Usamos 'wsrv.nl' como Proxy de Imágenes (Open Source).
  // Esto redimensiona, comprime y convierte a WebP al vuelo las imágenes de tu servidor.
  
  try {
    // URL limpia sin el protocolo para el proxy (aunque wsrv acepta con protocolo encoded)
    // Simplemente codificamos la URL completa de tu MinIO
    const encodedUrl = encodeURIComponent(url);

    // Construimos la URL del Proxy
    // url = tu imagen original
    // w = ancho deseado
    // q = calidad 80%
    // output = webp (formato moderno ligero)
    // fit = cover (recortar inteligente)
    return `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&q=80&output=webp&fit=cover`;
  } catch (e) {
    // Si falla algo en la codificación, devolvemos la original
    return url;
  }
};
