
import React, { useState, useEffect, useCallback } from 'react';
import { GalleryItem } from '../types';
import { supabase } from '../services/supabaseClient';
import { Loader2, PlusCircle, Trash2, Save, Edit, X, Filter, ChevronDown } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

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

const CATEGORIES = ['TODAS', 'Maquillaje', 'Atavío', 'Eventos', 'Detalles'];
const ITEMS_PER_PAGE = 10;

export const Gallery: React.FC<GalleryProps> = ({ isEditMode }) => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filter State
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Adding new image
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Eventos');

  // Editing existing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [tempImageFit, setTempImageFit] = useState<'cover' | 'contain'>('cover');
  const [tempImagePos, setTempImagePos] = useState<'center' | 'top' | 'bottom'>('center');

  const fetchGallery = useCallback(async (pageNumber: number, category: string, isAppend: boolean) => {
    try {
      if (isAppend) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query = supabase
        .from('gallery')
        .select('*', { count: 'exact' });

      // Apply filter if specific category selected
      if (category !== 'TODAS') {
        query = query.eq('category', category);
      }

      // Apply pagination
      const from = pageNumber * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        if (isAppend) {
          setImages(prev => [...prev, ...data as GalleryItem[]]);
        } else {
          setImages(data as GalleryItem[]);
        }

        // Check if there are more items to load
        if (count !== null) {
          setHasMore(from + data.length < count);
        }
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial Fetch & Filter Change
  useEffect(() => {
    setPage(0);
    fetchGallery(0, selectedCategory, false);
  }, [selectedCategory, fetchGallery]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGallery(nextPage, selectedCategory, true);
  };

  const handleSeedGallery = async () => {
    const { error } = await supabase.from('gallery').insert(SAMPLE_IMAGES);
    if (!error) {
       setPage(0);
       fetchGallery(0, selectedCategory, false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar foto?')) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) setImages(images.filter(i => i.id !== id));
  };

  const handleAdd = async () => {
    if (!newUrl) return;
    const { data, error } = await supabase
      .from('gallery')
      .insert([{ url: newUrl, category: newCategory }])
      .select();

    if (!error && data) {
      setNewUrl('');
      // Prepend new image to the list immediately
      setImages([data[0] as GalleryItem, ...images]);
    } else {
      alert("Error al guardar en la base de datos. Verifica permisos.");
    }
  };

  const startEdit = (img: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(img.id);
    setEditUrl(img.url);
    setTempImageFit(img.image_fit || 'cover');
    setTempImagePos(img.image_position as any || 'center');
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditUrl('');
  };

  const saveEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('gallery').update({ 
      url: editUrl,
      image_fit: tempImageFit,
      image_position: tempImagePos
    }).eq('id', id);

    if (!error) {
      setImages(images.map(i => i.id === id ? { 
        ...i, 
        url: editUrl,
        image_fit: tempImageFit,
        image_position: tempImagePos
      } : i));
      setEditingId(null);
    } else {
      alert("Error al actualizar la imagen");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550920456-0648218659dc?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <div className="bg-white py-24 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Nuestra Galería</h2>
          <p className="mt-4 text-xl text-gray-600">Testimonios visuales de nuestra pasión por el folklore.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-panamaBlue text-white shadow-lg transform -translate-y-1'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Edit Mode: Add New Photo */}
        {isEditMode && (
          <div className="mb-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto shadow-inner">
             <div className="flex items-center gap-2 mb-4 text-yellow-800 font-bold">
                <PlusCircle size={20} />
                <h3>Agregar Nueva Foto</h3>
             </div>
             <div className="flex flex-col gap-4">
               <input 
                  placeholder="Pegar URL de la imagen aquí..." 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-panamaBlue outline-none"
               />
               <div className="flex gap-4 items-stretch">
                   <div className="w-1/3 h-32 bg-white border rounded flex items-center justify-center overflow-hidden">
                     {newUrl ? <img src={newUrl} className="h-full w-full object-cover" onError={handleImageError} alt="preview" /> : <span className="text-gray-400 text-xs">Vista previa</span>}
                   </div>
                   <div className="flex-grow flex flex-col justify-between">
                      <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                      <select 
                          value={newCategory} 
                          onChange={e => setNewCategory(e.target.value)}
                          className="border p-3 rounded bg-white w-full mb-4"
                      >
                        {CATEGORIES.filter(c => c !== 'TODAS').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button 
                        onClick={handleAdd} 
                        disabled={!newUrl}
                        className={`p-3 rounded font-bold transition-colors ${!newUrl ? 'bg-gray-300 text-gray-500' : 'bg-panamaBlue text-white hover:bg-blue-900'}`}
                      >
                        Publicar Foto
                      </button>
                   </div>
               </div>
             </div>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-panamaBlue w-12 h-12" /></div>
        ) : images.length === 0 ? (
          <div className="text-center bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-200">
            <p className="mb-4 text-gray-500 text-lg">No hay fotos en esta categoría.</p>
            {isEditMode && (
              <button onClick={handleSeedGallery} className="bg-panamaBlue text-white px-6 py-3 rounded flex items-center mx-auto gap-2">
                <PlusCircle /> Cargar Fotos de Muestra
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((img) => (
                <div 
                  key={img.id} 
                  className={`relative group overflow-hidden aspect-square rounded-sm shadow-md bg-gray-100 ${isEditMode ? 'cursor-pointer ring-2 ring-transparent hover:ring-panamaBlue/50' : 'cursor-default'}`}
                  onClick={(e) => isEditMode && !editingId && startEdit(img, e)}
                >
                  
                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      {editingId === img.id ? (
                          <div className="flex gap-1 bg-white p-1 rounded-full shadow">
                            <button onClick={(e) => saveEdit(img.id, e)} className="p-2 rounded-full text-green-600 hover:bg-green-50"><Save size={18} /></button>
                            <button onClick={(e) => cancelEdit(e)} className="p-2 rounded-full text-gray-500 hover:bg-gray-50"><X size={18} /></button>
                          </div>
                      ) : (
                          <button onClick={(e) => startEdit(img, e)} className="bg-white p-2 rounded-full text-panamaBlue shadow-lg hover:bg-blue-50"><Edit size={18} /></button>
                      )}
                      <button onClick={(e) => handleDelete(img.id, e)} className="bg-white p-2 rounded-full text-red-600 shadow-lg hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                  )}

                  {editingId === img.id ? (
                      <div className="absolute inset-0 bg-white p-4 z-10 flex flex-col justify-start overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">URL</label>
                        <textarea 
                            value={editUrl} 
                            onChange={e => setEditUrl(e.target.value)} 
                            className="w-full h-12 border p-2 text-xs rounded focus:ring-2 focus:ring-panamaBlue focus:outline-none mb-2" 
                            placeholder="Nueva URL..."
                        />
                        
                        <div className="flex gap-2 mb-2">
                          <div className="w-1/2">
                            <label className="text-[10px] font-bold text-gray-500 mb-1 block">Ajuste</label>
                            <select 
                              value={tempImageFit}
                              onChange={(e: any) => setTempImageFit(e.target.value)}
                              className="w-full border p-1 text-xs rounded"
                            >
                              <option value="cover">Llenar</option>
                              <option value="contain">Completa</option>
                            </select>
                          </div>
                          <div className="w-1/2">
                            <label className="text-[10px] font-bold text-gray-500 mb-1 block">Posición</label>
                            <select 
                              value={tempImagePos}
                              onChange={(e: any) => setTempImagePos(e.target.value)}
                              className="w-full border p-1 text-xs rounded"
                            >
                              <option value="center">Centro</option>
                              <option value="top">Arriba</option>
                              <option value="bottom">Abajo</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex-grow bg-gray-50 rounded border flex items-center justify-center overflow-hidden mb-2 relative">
                          {editUrl ? (
                              <img 
                                src={getOptimizedImageUrl(editUrl, 300)} 
                                className="w-full h-full"
                                style={{ objectFit: tempImageFit, objectPosition: tempImagePos }} 
                                alt="preview" 
                              />
                          ) : <span>Preview</span>}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={(e) => saveEdit(img.id, e)} className="flex-1 bg-green-600 text-white text-xs py-2 rounded font-bold hover:bg-green-700">Guardar</button>
                            <button onClick={(e) => cancelEdit(e)} className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded font-bold hover:bg-gray-300">Cancelar</button>
                        </div>
                      </div>
                  ) : (
                    <>
                      <img 
                        src={getOptimizedImageUrl(img.url, 600)} 
                        onError={handleImageError}
                        alt={img.category} 
                        loading="lazy"
                        className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
                        style={{ 
                          objectFit: img.image_fit || 'cover',
                          objectPosition: img.image_position || 'center'
                        }}
                      />
                      
                      {!editingId && (
                        <div className={`absolute inset-0 bg-black/40 ${isEditMode ? 'opacity-0 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 flex items-center justify-center pointer-events-none`}>
                          {isEditMode ? (
                            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow">Editar Imagen</span>
                          ) : (
                            <span className="text-white font-serif font-bold text-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-2 border-white px-6 py-2 tracking-widest uppercase text-center mx-4">
                              {img.category}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button 
                  onClick={loadMore} 
                  disabled={isLoadingMore}
                  className="bg-white border-2 border-panamaBlue text-panamaBlue px-8 py-3 rounded-full font-bold hover:bg-panamaBlue hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isLoadingMore ? <Loader2 className="animate-spin" /> : <ChevronDown />}
                  Cargar más fotos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
