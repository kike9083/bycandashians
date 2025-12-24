
import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

const filesToOptimize = [
    { input: 'pollera-santeña.png', output: 'pollera-santena-optimized.jpg', width: 1920, quality: 80 }
];

(async () => {
    for (const file of filesToOptimize) {
        try {
            console.log(`Processing ${file.input}...`);
            const inputPath = path.join(publicDir, file.input);
            const outputPath = path.join(publicDir, file.output);

            const image = await Jimp.read(inputPath);

            if (image.width > file.width) {
                image.resize({ w: file.width }); // Auto height
            }

            await image.write(outputPath, { quality: file.quality }); // write() handles format by extension in v1?
            // Actually in newer jimp versions syntax might differ, but let's try standard.
            // If strict jimp import, writes might need specific mime.
            // Let's assume standard jimp behavior.

            console.log(`Saved optimized image to ${file.output}`);
        } catch (err) {
            console.error(`Error processing ${file.input}:`, err);
        }
    }
})();
