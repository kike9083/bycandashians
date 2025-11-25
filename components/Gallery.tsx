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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550920456-0648218659dc?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <div className="bg-white py-24 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Nuestra Galería</h2>
          <p className="mt-4 text-xl text-gray-600">Testimonios visuales de nuestra pasión por el folklore.</p>
        </div>

        {isEditMode && (
          <div className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-lg max-w-xl mx-auto shadow-inner">
             <h3 className="font-bold mb-4 text-lg">Agregar Nueva Foto</h3>
             <div className="flex flex-col gap-4">
               <input 
                  placeholder="URL de la imagen" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  className="border p-3 rounded w-full"
               />
               <div className="h-32 bg-white border rounded flex items-center justify-center overflow-hidden">
                 {newUrl ? <img src={newUrl} className="h-full w-full object-cover" onError={handleImageError} alt="preview" /> : <span className="text-gray-400">Vista previa</span>}
               </div>
               <div className="flex gap-4">
                   <select 
                      value={newCategory} 
                      onChange={e => setNewCategory(e.target.value)}
                      className="border p-3 rounded bg-white w-1/3"
                   >
                     <option>Eventos</option>
                     <option>Detalles</option>
                     <option>Maquillaje</option>
                     <option>Atavío</option>
                   </select>
                   <button onClick={handleAdd} className="bg-panamaBlue text-white p-3 rounded hover:bg-blue-900 flex-grow font-bold">
                     Agregar Foto
                   </button>
               </div>
             </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-panamaBlue w-12 h-12" /></div>
        ) : images.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">Galería vacía.</p>
            <button onClick={handleSeedGallery} className="bg-panamaBlue text-white px-6 py-3 rounded flex items-center mx-auto gap-2">
              <PlusCircle /> Cargar Fotos de Muestra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden aspect-square rounded-sm cursor-pointer shadow-md bg-gray-100">
                
                {isEditMode && (
                  <div className="absolute top-2 right-2 z-20 flex gap-2">
                     {editingId === img.id ? (
                        <button onClick={() => saveEdit(img.id)} className="bg-white p-2 rounded-full text-green-600 shadow-lg hover:bg-green-50"><Save size={18} /></button>
                     ) : (
                        <button onClick={() => startEdit(img)} className="bg-white p-2 rounded-full text-panamaBlue shadow-lg hover:bg-blue-50"><Edit size={18} /></button>
                     )}
                     <button onClick={() => handleDelete(img.id)} className="bg-white p-2 rounded-full text-red-600 shadow-lg hover:bg-red-50"><Trash2 size={18} /></button>
                  </div>
                )}

                {editingId === img.id ? (
                    <div className="absolute inset-0 bg-white p-4 z-10 flex flex-col justify-center">
                       <label className="text-xs font-bold mb-1">Editar URL:</label>
                       <textarea 
                          value={editUrl} 
                          onChange={e => setEditUrl(e.target.value)} 
                          className="w-full h-32 border p-2 text-xs" 
                       />
                    </div>
                ) : (
                    <img 
                      src={img.url} 
                      onError={handleImageError}
                      alt={img.category} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-serif font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-2 border-white px-6 py-2 tracking-widest uppercase">
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