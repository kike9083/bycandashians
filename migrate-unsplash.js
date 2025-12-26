
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imageDir = path.join(__dirname, 'public', 'image');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const imagesToDownload = [
    // Services
    { name: 'service-alquiler.jpg', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop' },
    { name: 'service-atavio.jpg', url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop' },
    { name: 'service-makeup.jpg', url: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=600&auto=format&fit=crop' },
    { name: 'service-folk.jpg', url: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=600&auto=format&fit=crop' },
    { name: 'service-photo.jpg', url: 'https://images.unsplash.com/photo-1551189671-d68b6356d62c?q=80&w=600&auto=format&fit=crop' },
    { name: 'service-fallback.jpg', url: 'https://images.unsplash.com/photo-1550920456-0648218659dc?q=80&w=600&auto=format&fit=crop' },
    // Catalog
    { name: 'catalog-gala.jpg', url: 'https://images.unsplash.com/photo-1596906660183-f32f319200b3?q=80&w=1000&auto=format&fit=crop' },
    { name: 'catalog-montuna.jpg', url: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=1000&auto=format&fit=crop' },
    { name: 'catalog-congo.jpg', url: 'https://images.unsplash.com/photo-1523974447453-deb40652b04c?q=80&w=1000&auto=format&fit=crop' },
    { name: 'catalog-veraguense.jpg', url: 'https://images.unsplash.com/photo-1605289355680-75fbbee5c324?q=80&w=1000&auto=format&fit=crop' }
];

const downloadImage = (name, url) => {
    const filepath = path.join(imageDir, name);

    return new Promise((resolve, reject) => {
        console.log(`Downloading ${name} from ${url}...`);
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Successfully downloaded ${name}`);
                    resolve();
                });
            } else {
                console.error(`Failed to download ${name}: Status Code ${res.statusCode}`);
                resolve();
            }
        }).on('error', (err) => {
            console.error(`Error downloading ${name}: ${err.message}`);
            resolve();
        });
    });
};

(async () => {
    console.log('Starting migration of Unsplash images to local /image folder...');
    for (const img of imagesToDownload) {
        await downloadImage(img.name, img.url);
    }
    console.log('Migration finished.');
})();
