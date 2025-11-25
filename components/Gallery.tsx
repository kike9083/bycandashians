import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { supabase } from '../services/supabaseClient';
import { Loader2, PlusCircle, Trash2, Save, Edit } from 'lucide-react';

interface GalleryProps {
  isEditMode: boolean;
}

const SAMPLE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1596906660183-f32f319200b3?q=80&w=600&auto=format&fit=crop', category: 'Detalles' },
  { url: 'https://images.unsplash.com/photo-1523974447453-deb40652b04c?q=80&w=600&auto=format&fit=crop', category: 'Maquillaje' },
  { url: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop', category: 'Atavío' },
  { url: 'https://images.unsplash.com/photo-1545960920-d33621437193?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1550920456-0648218659dc?q=80&w=600&auto=format&fit=crop', category: 'Detalles' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1574660309995-177b919d3cf4?q=80&w=600&auto=format&fit=crop', category: 'Maquillaje' },
  { url: 'https://images.unsplash.com/photo-1509670118595-6ae742d48347?q=80&w=600&auto=format&fit=crop', category: 'Detalles' }
];

export const Gallery: React.FC<GalleryProps> = ({ isEditMode }) => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Adding new image
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Eventos');
  const [isAdding, setIsAdding] = useState(false);

  // Editing existing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data as GalleryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSeedGallery = async () => {
    const { error } = await supabase.from('gallery').insert(SAMPLE_IMAGES);
    if (!error) fetchGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar foto?')) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) setImages(images.filter(i => i.id !== id));
  };

  const handleAdd = async () => {
    if (!newUrl) return;
    const { error } = await supabase.from('gallery').insert([{ url: newUrl, category: newCategory }]);
    if (!error) {
      setNewUrl('');
      setIsAdding(false);
      fetchGallery();
    }
  };

  const startEdit = (img: GalleryItem) => {
    setEditingId(img.id);
    setEditUrl(img.url);
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('gallery').update({ url: editUrl }).eq('id', id);
    if (!error) {
      setImages(images.map(i => i.id === id ? { ...i, url: editUrl } : i));
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Nuestra Galería</h2>
          <p className="mt-4 text-gray-600">Testimonios visuales de nuestra pasión por el folklore.</p>
        </div>

        {isEditMode && (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg mx-auto">
             <h3 className="font-bold mb-2">Agregar Nueva Foto</h3>
             <div className="flex flex-col gap-2">
               <input 
                  placeholder="URL de la imagen" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  className="border p-2 rounded"
               />
               <select 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)}
                  className="border p-2 rounded bg-white"
               >
                 <option>Eventos</option>
                 <option>Detalles</option>
                 <option>Maquillaje</option>
                 <option>Atavío</option>
               </select>
               <button onClick={handleAdd} className="bg-panamaBlue text-white p-2 rounded hover:bg-blue-900">
                 Agregar Foto
               </button>
             </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-panamaBlue" /></div>
        ) : images.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">Galería vacía.</p>
            <button onClick={handleSeedGallery} className="bg-panamaBlue text-white px-4 py-2 rounded flex items-center mx-auto gap-2">
              <PlusCircle /> Cargar Fotos de Muestra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden aspect-square rounded-lg cursor-pointer shadow-md bg-gray-100">
                
                {isEditMode && (
                  <div className="absolute top-2 right-2 z-20 flex gap-2">
                     {editingId === img.id ? (
                        <button onClick={() => saveEdit(img.id)} className="bg-white p-1 rounded-full text-green-600 shadow"><Save size={16} /></button>
                     ) : (
                        <button onClick={() => startEdit(img)} className="bg-white p-1 rounded-full text-panamaBlue shadow"><Edit size={16} /></button>
                     )}
                     <button onClick={() => handleDelete(img.id)} className="bg-white p-1 rounded-full text-red-600 shadow"><Trash2 size={16} /></button>
                  </div>
                )}

                {editingId === img.id ? (
                    <div className="absolute inset-0 bg-white p-4 z-10 flex items-center justify-center">
                       <textarea 
                          value={editUrl} 
                          onChange={e => setEditUrl(e.target.value)} 
                          className="w-full h-full border p-2 text-xs" 
                       />
                    </div>
                ) : (
                    <img 
                      src={img.url} 
                      alt={img.category} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                )}
                
                <div className="absolute inset-0 bg-panamaBlue/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-serif font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-2 border-white px-4 py-2">
                    {img.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};