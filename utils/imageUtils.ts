export const localizeImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;

  const KEEP_LOCAL = ['logo.png', 'duenas-5.jpg', 'portada-bg.jpg', 'duenas-3.jpg', 'duenas-5.png', 'portada-bg.png', 'duenas-3.png'];

  if (url.startsWith('/image/')) {
    const filename = url.split('/').pop();
    if (filename && !KEEP_LOCAL.includes(filename)) {
      // Decodificar y normalizar nombre (ñ -> n) para coincidir con lo subido a Supabase
      const decodedName = decodeURIComponent(filename)
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'n')
        .replace(/\s+/g, '-');

      const baseName = decodedName.split('.')[0];
      return `https://varios-supabase-bycandashians.fjueze.easypanel.host/storage/v1/object/public/bycandashan/site-assets-v2/${baseName}.jpg`;
    }
    return url;
  }

  if (url.includes('console-varios-minio.fjueze.easypanel.host')) {
    try {
      const urlObj = new URL(url);
      const prefix = urlObj.searchParams.get('prefix');
      if (prefix) {
        const filename = prefix.split('/').pop() || prefix.split('%2F').pop();
        if (filename) {
          const decodedName = decodeURIComponent(filename)
            .replace(/ñ/g, 'n')
            .replace(/Ñ/g, 'n')
            .replace(/\s+/g, '-');

          const baseName = decodedName.split('.')[0];
          return `https://varios-supabase-bycandashians.fjueze.easypanel.host/storage/v1/object/public/bycandashan/site-assets-v2/${baseName}.jpg`;
        }
      }
    } catch (e) {
      console.error('Error parsing MinIO URL:', e);
    }
  }
  return url;
};

export const getOptimizedImageUrl = (url: string, width: number = 800): string => {
  if (!url) return '';

  // 1. Transform legacy URLs to local ones
  const localizedUrl = localizeImageUrl(url);

  // 2. Si es una imagen Base64 or already local, devolver tal cual
  if (localizedUrl.startsWith('data:') || localizedUrl.startsWith('/')) {
    return localizedUrl;
  }

  // 3. Optimización Nativa para Unsplash
  if (localizedUrl.includes('images.unsplash.com')) {
    const separator = localizedUrl.includes('?') ? '&' : '?';
    let newUrl = localizedUrl;

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
    // Simplemente codificamos la URL completa
    const encodedUrl = encodeURIComponent(localizedUrl);

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
