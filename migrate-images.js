
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imageDir = path.join(__dirname, 'public', 'image');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const minioBase = 'https://console-varios-minio.fjueze.easypanel.host/api/v1/buckets/bycandashan/objects/download?preview=true&prefix=images%2F';

const imagesToDownload = [
    'dueñas-5.png',
    'desfila-de-polleras-2.png',
    'pollera-landing-1.png',
    'dueñas-3.jpg',
    'galeria-4.jpg',
    'atavio-2.png',
    'atavio-4.png',
    'galeria-8.jpg',
    'pareja-1.png',
    'galeria-1.jpg',
    'galeria-2.jpg',
    'galeria-5.jpg',
    'galeria-6.jpg',
    'galeria-3.jpg',
    'galeria-7.jpg'
];

const downloadImage = (filename) => {
    const url = `${minioBase}${encodeURIComponent(filename)}&version_id=null`;
    const filepath = path.join(imageDir, filename);

    return new Promise((resolve, reject) => {
        console.log(`Downloading ${filename}...`);
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Successfully downloaded ${filename}`);
                    resolve();
                });
            } else {
                console.error(`Failed to download ${filename}: Status Code ${res.statusCode}`);
                resolve(); // Continue with others
            }
        }).on('error', (err) => {
            console.error(`Error downloading ${filename}: ${err.message}`);
            resolve();
        });
    });
};

(async () => {
    console.log('Starting migration of images from MinIO to local /image folder...');
    for (const filename of imagesToDownload) {
        await downloadImage(filename);
    }
    console.log('Migration finished.');
})();
