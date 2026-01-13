
import { createClient } from '@supabase/supabase-js';

// Credenciales ANTIGUAS (Recuperadas del historial)
const oldSupabaseUrl = 'https://varios-supabase-bycandashians.fjueze.easypanel.host';
const oldSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'.replace(/\s/g, '');

const oldClient = createClient(oldSupabaseUrl, oldSupabaseKey);

async function checkOldBucket() {
    console.log('Conectando al servidor antiguo...');

    // Intentar listar archivos del bucket 'bycandashan' carpeta 'site-assets-v2'
    const { data, error } = await oldClient
        .storage
        .from('bycandashan')
        .list('site-assets-v2', { limit: 10 });

    if (error) {
        console.error('Error al acceder al almacenamiento antiguo:', error);
    } else {
        console.log('¡Éxito! Archivos encontrados en el servidor antiguo:');
        data.forEach(file => console.log(` - ${file.name} (${(file.metadata.size / 1024).toFixed(2)} KB)`));
    }
}

checkOldBucket();
