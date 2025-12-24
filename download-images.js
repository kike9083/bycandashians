
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

const images = [
    {
        name: 'pollera-santeña.png',
        url: 'https://console-varios-minio.fjueze.easypanel.host/api/v1/buckets/bycandashan/objects/download?preview=true&prefix=images%2Fpollera-de-gala-sante%C3%B1a-1.png&version_id=null'
    },
    {
        name: 'story-origin.jpg',
        url: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop'
    },
    {
        name: 'story-craft.jpg',
        url: 'https://images.unsplash.com/photo-1610173827002-6b4028589080?q=80&w=1000&auto=format&fit=crop'
    },
    {
        name: 'video-thumb.jpg',
        url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1600&auto=format&fit=crop'
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    const stats = fs.statSync(filepath);
                    console.log(`Downloaded ${path.basename(filepath)}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: Status Code ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
};

(async () => {
    console.log('Starting downloads...');
    if (!fs.existsSync(publicDir)) {
        console.log('Creating public dir...');
        fs.mkdirSync(publicDir);
    }

    for (const img of images) {
        try {
            await downloadImage(img.url, path.join(publicDir, img.name));
        } catch (e) {
            console.error(e);
        }
    }
    console.log('Done.');
})();
