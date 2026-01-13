
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojbwzjxuudbxdjvcqsro.supabase.co';
const supabaseKey = 'sb_publishable_FnFmKdsWNzLoj5S9_mplHA_JEcCZVzB';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUrls() {
    console.log('--- Verificando URLs en tabla gallery ---');
    const { data: gallery, error: errorG } = await supabase.from('gallery').select('id, url').limit(5);
    if (errorG) console.error('Error gallery:', errorG);
    else {
        gallery.forEach(item => {
            console.log(`[Gallery ID ${item.id}]: ${item.url.substring(0, 80)}...`);
        });
    }

    console.log('\n--- Verificando URLs en tabla products ---');
    const { data: products, error: errorP } = await supabase.from('products').select('id, image').limit(5);
    if (errorP) console.error('Error products:', errorP);
    else {
        products.forEach(item => {
            console.log(`[Product ID ${item.id}]: ${item.image.substring(0, 80)}...`);
        });
    }
}

checkUrls();
