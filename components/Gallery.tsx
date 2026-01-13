
import React, { useState, useEffect, useCallback } from 'react';
import { GalleryItem } from '../types';
import { supabase } from '../services/supabaseClient';
import { Loader2, PlusCircle, Trash2, Save, Edit, X, Filter, ChevronDown, Upload } from 'lucide-react';
import { getOptimizedImageUrl, localizeImageUrl } from '../utils/imageUtils';
import { ImageUploadModal } from './ImageUploadModal';

interface GalleryProps {
  isEditMode: boolean;
}

const SAMPLE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1596906660183-f32f319200b3?q=80&w=600&auto=format&fit=crop', category: 'Alquileres' },
  { url: 'https://images.unsplash.com/photo-1523974447453-deb40652b04c?q=80&w=600&auto=format&fit=crop', category: 'Maquillaje' },
  { url: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop', category: 'Atavío' },
  { url: 'https://images.unsplash.com/photo-1545960920-d33621437193?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1550920456-0648218659dc?q=80&w=600&auto=format&fit=crop', category: 'Alquileres' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop', category: 'Eventos' },
  { url: 'https://images.unsplash.com/photo-1574660309995-177b919d3cf4?q=80&w=600&auto=format&fit=crop', category: 'Maquillaje' },
  { url: 'https://images.unsplash.com/photo-1509670118595-6ae742d48347?q=80&w=600&auto=format&fit=crop', category: 'Alquileres' }
];

const CATEGORIES = ['TODAS', 'Maquillaje', 'Atavío', 'Eventos', 'Alquileres', 'Fotos'];
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

  const [tempCategory, setTempCategory] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const handleAddMultiple = async (urls: string[]) => {
    const itemsToInsert = urls.map(url => ({
      url,
      category: newCategory
    }));

    const { data, error } = await supabase
      .from('gallery')
      .insert(itemsToInsert)
      .select();

    if (!error && data) {
      setImages([...(data as GalleryItem[]), ...images]);
    } else {
      alert("Error al guardar en la base de datos: " + (error?.message || 'Error desconocido'));
    }
  };

  const startEdit = (img: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(img.id);
    setEditUrl(localizeImageUrl(img.url));
    setTempImageFit(img.image_fit || 'cover');
    setTempImagePos(img.image_position as any || 'center');
    setTempCategory(img.category || 'Eventos');
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
      image_position: tempImagePos,
      category: tempCategory
    }).eq('id', id);

    if (!error) {
      setImages(images.map(i => i.id === id ? {
        ...i,
        url: editUrl,
        image_fit: tempImageFit,
        image_position: tempImagePos,
        category: tempCategory
      } : i));
      setEditingId(null);
    } else {
      alert("Error al actualizar la imagen");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Prevent infinite loop if fallback also fails
    const target = e.currentTarget;
    if (target.dataset.hasError) return;

    target.dataset.hasError = "true";
    target.src = getOptimizedImageUrl('/image/duenas-3.jpg');
    target.onerror = null; // Final safety net
  };

  return (
    <div className="bg-background-dark pt-[250px] pb-24 w-full min-h-screen">
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold bg-gold/10 px-4 py-1 rounded-full border border-gold/20 backdrop-blur-sm mb-4 inline-block">
            Portafolio
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ivory tracking-tight">Galería de Polleras y Eventos</h1>
          <p className="mt-4 text-xl text-ivory/60 font-light max-w-2xl mx-auto">Testimonios visuales de nuestra pasión por el folklore, capturando la esencia de cada detalle.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up delay-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                ? 'bg-gold text-background-dark shadow-lg shadow-gold/20 scale-105'
                : 'bg-white/5 text-ivory/60 hover:bg-white/10 hover:text-ivory border border-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Edit Mode: Add New Photo */}
        {isEditMode && (
          <div className="mb-12 p-8 bg-card-dark border border-gold/20 rounded-[2rem] max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <PlusCircle size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-ivory">Gestionar Galería</h3>
                </div>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="bg-background-dark border border-white/10 text-ivory px-4 py-2 rounded-xl focus:border-gold outline-none text-sm font-bold"
                  title="Seleccionar Categoría"
                >
                  {CATEGORIES.filter(c => c !== 'TODAS').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div
                onClick={() => setIsUploadModalOpen(true)}
                className="border-2 border-dashed border-gold/20 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group/upload"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover/upload:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-ivory font-bold text-lg">Subir Fotos a la Carpeta</p>
                  <p className="text-ivory/40 text-sm mt-1">Selecciona una o varias imágenes de tu computadora</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-gold w-12 h-12" /></div>
        ) : images.length === 0 ? (
          <div className="text-center bg-card-dark p-12 rounded-3xl border border-dashed border-white/10">
            <p className="mb-6 text-ivory/40 text-lg">No hay fotos en esta categoría.</p>
            {isEditMode && (
              <button onClick={handleSeedGallery} className="bg-primary text-background-dark px-6 py-3 rounded-full font-bold hover:bg-gold transition-colors inline-flex items-center gap-2">
                <PlusCircle size={18} /> Cargar Fotos de Muestra
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 animate-fade-in-up delay-200">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative group break-inside-avoid rounded-2xl overflow-hidden bg-card-dark ${isEditMode ? 'cursor-pointer ring-2 ring-transparent hover:ring-gold/50' : 'cursor-zoom-in'}`}
                  onClick={(e) => isEditMode && !editingId && startEdit(img, e)}
                >

                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {editingId === img.id ? (
                        <div className="flex gap-1 bg-black/80 backdrop-blur-md p-1 rounded-full border border-white/10">
                          <button onClick={(e) => saveEdit(img.id, e)} className="p-2 rounded-full text-green-400 hover:bg-white/10" title="Guardar cambios"><Save size={16} /></button>
                          <button onClick={(e) => cancelEdit(e)} className="p-2 rounded-full text-red-400 hover:bg-white/10" title="Cancelar edición"><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={(e) => startEdit(img, e)} className="bg-black/80 backdrop-blur-md p-2 rounded-full text-gold border border-gold/30 hover:bg-gold hover:text-black transition-colors" title="Editar imagen"><Edit size={16} /></button>
                      )}
                      <button onClick={(e) => handleDelete(img.id, e)} className="bg-black/80 backdrop-blur-md p-2 rounded-full text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors" title="Eliminar imagen"><Trash2 size={16} /></button>
                    </div>
                  )}

                  {editingId === img.id ? (
                    <div className="bg-card-dark p-4 border border-gold/20 rounded-2xl flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                      <div>
                        <label className="text-[10px] font-bold text-gold uppercase tracking-wider mb-2 block">Imagen de la Obra</label>
                        <button
                          onClick={() => setIsUploadModalOpen(true)}
                          className="w-full flex items-center justify-center gap-2 bg-background-dark border border-gold/30 hover:border-gold hover:bg-gold/10 text-ivory p-3 rounded-xl transition-all group/btn"
                        >
                          <Upload size={16} className="text-gold group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-wider">Cambiar Imagen</span>
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold text-gold/70 uppercase mb-1 block">Ajuste</label>
                          <select
                            value={tempImageFit}
                            onChange={(e: any) => setTempImageFit(e.target.value)}
                            className="w-full bg-background-dark border border-white/10 p-1 text-xs rounded text-ivory"
                            title="Ajuste de Imagen"
                          >
                            <option value="cover">Llenar</option>
                            <option value="contain">Completa</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold text-gold/70 uppercase mb-1 block">Posición</label>
                          <select
                            value={tempImagePos}
                            onChange={(e: any) => setTempImagePos(e.target.value)}
                            className="w-full bg-background-dark border border-white/10 p-1 text-xs rounded text-ivory"
                            title="Posición de Imagen"
                          >
                            <option value="center">Centro</option>
                            <option value="top">Arriba</option>
                            <option value="bottom">Abajo</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-1">
                        <label className="text-[10px] font-bold text-gold/70 uppercase mb-1 block">Categoría</label>
                        <select
                          value={tempCategory}
                          onChange={(e) => setTempCategory(e.target.value)}
                          className="w-full bg-background-dark border border-white/10 p-1 text-xs rounded text-ivory focus:border-gold outline-none"
                          title="Categoría de Imagen"
                        >
                          {CATEGORIES.filter(c => c !== 'TODAS').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="h-24 bg-background-dark rounded border border-white/10 flex items-center justify-center overflow-hidden relative">
                        {editUrl ? (
                          <img
                            src={getOptimizedImageUrl(editUrl, 300)}
                            className="w-full h-full"
                            style={{ objectFit: tempImageFit, objectPosition: tempImagePos }}
                            alt="preview"
                          />
                        ) : <span className="text-xs text-ivory/20">Sin imagen</span>}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <button onClick={(e) => saveEdit(img.id, e)} className="flex-1 bg-primary text-background-dark text-xs py-2 rounded font-bold hover:bg-gold uppercase tracking-wider">Guardar</button>
                        <button onClick={(e) => cancelEdit(e)} className="flex-1 bg-white/5 text-ivory/50 text-xs py-2 rounded font-bold hover:bg-white/10 uppercase tracking-wider">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={getOptimizedImageUrl(img.url, 600)}
                          onError={handleImageError}
                          alt={img.category}
                          loading="lazy"
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                          style={{
                            objectFit: img.image_fit || 'cover',
                            objectPosition: img.image_position || 'center'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">By Candashians</span>
                            <span className="text-ivory font-serif text-2xl font-medium tracking-wide block">
                              {img.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Button */}
            {hasMore && (
              <div className="mt-20 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="bg-transparent border border-gold/30 text-gold px-10 py-4 rounded-full font-bold hover:bg-gold hover:text-background-dark transition-all uppercase tracking-[0.2em] text-xs flex items-center gap-3 mx-auto disabled:opacity-50 group"
                >
                  {isLoadingMore ? <Loader2 className="animate-spin" /> : <ChevronDown className="group-hover:translate-y-1 transition-transform" />}
                  Ver Más Colección
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={(urls) => {
          if (editingId) {
            setEditUrl(urls[0]);
          } else {
            handleAddMultiple(urls);
          }
        }}
        allowMultiple={!editingId}
      />
    </div>
  );
};
