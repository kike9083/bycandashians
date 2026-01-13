
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojbwzjxuudbxdjvcqsro.supabase.co';
const supabaseKey = 'sb_publishable_FnFmKdsWNzLoj5S9_mplHA_JEcCZVzB';
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_PATH = `${supabaseUrl}/storage/v1/object/public/bycandashan/site-assets-v2`;

function cleanFilename(filename) {
    return decodeURIComponent(filename)
        .replace(/ñ/g, 'n')
        .replace(/Ñ/g, 'n')
        .replace(/\s+/g, '-')
        .split('/').pop() // remove any folder like 'images/'
        .split('.')[0] + '.jpg'; // ensure jpg extension
}

async function migrateTable(tableName, column = 'url') {
    console.log(`Processing table: ${tableName}...`);
    const { data: items, error } = await supabase.from(tableName).select(`id, ${column}`);

    if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return;
    }

    let count = 0;
    for (const item of items) {
        const oldUrl = item[column];
        if (!oldUrl || oldUrl.includes(supabaseUrl)) continue; // Already migrated or empty

        let newFilename = '';

        if (oldUrl.includes('minio')) {
            // Extract from MinIO param
            try {
                const urlObj = new URL(oldUrl);
                const prefix = urlObj.searchParams.get('prefix');
                if (prefix) {
                    newFilename = cleanFilename(prefix);
                }
            } catch (e) {
                console.error('Error parsing URL:', oldUrl);
            }
        } else if (oldUrl.includes('easypanel.host')) {
            // Extract from path
            const parts = oldUrl.split('/');
            const lastPart = parts[parts.length - 1];
            newFilename = cleanFilename(lastPart);
        } else if (oldUrl.startsWith('/image/')) {
            // Local path
            newFilename = cleanFilename(oldUrl); // e.g., /image/foo.jpg -> foo.jpg
        }

        if (newFilename) {
            const newUrl = `${TARGET_PATH}/${newFilename}`;
            console.log(`Migrating ${item.id}: \n   Old: ${oldUrl} \n   New: ${newUrl}`);

            const { error: updateError } = await supabase
                .from(tableName)
                .update({ [column]: newUrl })
                .eq('id', item.id);

            if (updateError) console.error('Update failed:', updateError);
            else count++;
        }
    }
    console.log(`Updated ${count} rows in ${tableName}.`);
}

async function run() {
    await migrateTable('gallery', 'url');
    await migrateTable('products', 'image');
}

run();
