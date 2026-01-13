
import React, { useState, useEffect } from 'react';
import { PolleraType, Product, View } from '../types';
import { Filter, ShoppingBag, Loader2, AlertCircle, Database, PlusCircle, Trash2, Edit, Save, X, Upload, ChevronDown } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getOptimizedImageUrl, localizeImageUrl } from '../utils/imageUtils';
import { ImageUploadModal } from './ImageUploadModal';

interface CatalogProps {
  setView: (view: View) => void;
  isEditMode: boolean;
}

const SAMPLE_PRODUCTS = [
  {
    name: 'Pollera de Gala Santeña',
    type: 'Pollera de Gala',
    price: 450.00,
    description: 'Exquisita pollera de gala santeña con labores zurcidas y caladas. Incluye joyero completo.',
    image: '/image/pollera-santena-optimized.jpg'
  },
  {
    name: 'Pollera Montuna Santeña',
    type: 'Pollera Montuna',
    price: 180.00,
    description: 'Colorida montuna santeña con camisa marcada en punto de cruz y faldón de zaraza floral.',
    image: '/image/catalog-montuna.jpg'
  },

  {
    name: 'Pollera Veragüense',
    type: 'Pollera Veragüense',
    price: 200.00,
    description: 'Hermosa pollera de la región de Veraguas, caracterizada por sus tonos pastel y elegancia sencilla.',
    image: '/image/dueñas-3.jpg'
  }
];

export const Catalog: React.FC<CatalogProps> = ({ setView, isEditMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempImageFit, setTempImageFit] = useState<'cover' | 'contain'>('cover');
  const [tempImagePos, setTempImagePos] = useState<'center' | 'top' | 'bottom'>('center');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempPrice, setTempPrice] = useState(0);
  const [tempType, setTempType] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableTypes = Array.from(new Set([
    ...Object.values(PolleraType),
    ...products.map(p => p.type)
  ]))
    .filter(Boolean)
    .filter(t =>
      t !== 'Gala' &&
      t !== 'Montuna' &&
      t !== 'Pollera Congo' &&
      t !== 'Pollera Antoñera' &&
      t !== 'Pollera Basquiña' &&
      t !== 'Pollera Estilizada'
    ) // Remove legacy and requested types
    .sort() as string[];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data as Product[]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(`Error: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedError(false);
    try {
      const { error } = await supabase.from('products').insert(SAMPLE_PRODUCTS);
      if (error) throw error;
      await fetchProducts(); // Reload data
    } catch (err: any) {
      console.error('Error seeding data:', err);
      setSeedError(true);
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar esta pollera?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error al eliminar producto");
    }
  };

  const startEdit = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(product.id);
    setTempImageUrl(localizeImageUrl(product.image));
    setTempImageFit(product.image_fit || 'cover');
    setTempImagePos(product.image_position as any || 'center');
    setTempName(product.name);
    setTempDescription(product.description);
    setTempPrice(product.price);
    setTempType(product.type);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('products').update({
      image: tempImageUrl,
      image_fit: tempImageFit,
      image_position: tempImagePos,
      name: tempName,
      description: tempDescription,
      price: tempPrice,
      type: tempType,
      technique: ''
    }).eq('id', id);

    if (!error) {
      setProducts(products.map(p => p.id === id ? {
        ...p,
        image: tempImageUrl,
        image_fit: tempImageFit,
        image_position: tempImagePos,
        name: tempName,
        description: tempDescription,
        price: tempPrice,
        type: tempType
      } : p));
      setEditingId(null);
    } else {
      alert('Error al actualizar producto');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.dataset.hasError) return;

    target.dataset.hasError = "true";
    target.src = getOptimizedImageUrl('/image/duenas-3.jpg'); // Fallback
    target.onerror = null;
  };

  const filteredProducts = products.filter(p => {
    if (filterType === 'ALL') return true;

    // Normalización para comparación robusta (ignora prefijos "Pollera de/para")
    const normalize = (s: string) => (s || '').toLowerCase()
      .replace(/^pollera (de |para |la )?/, '')
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
      .trim();

    return p.type === filterType || normalize(p.type) === normalize(filterType);
  });



  return (
    <div className="bg-background-dark min-h-screen pt-[250px] pb-16 w-full text-ivory">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-olive/20 pb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-ivory animate-fade-in-up">Catálogo de Alquiler de Polleras y Atavíos</h1>
            <p className="mt-2 text-xl text-ivory/60 animate-fade-in-up delay-100">Alquiler de polleras de gala y montunas exclusivas para tu próximo evento.</p>
          </div>
        </div>



        {/* Filtros Compactos y Ajuste de Grid */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-80">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full bg-card-dark border border-gold/20 px-6 py-4 rounded-2xl flex items-center justify-between group hover:border-gold transition-all shadow-xl"
            >
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gold" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {filterType === 'ALL' ? 'Todas las Categorías' : filterType}
                </span>
              </div>
              <ChevronDown size={20} className={`text-gold transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card-dark border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] overflow-hidden animate-fade-in">
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                  <button
                    onClick={() => { setFilterType('ALL'); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${filterType === 'ALL' ? 'bg-gold text-background-dark font-bold' : 'text-ivory/60 hover:bg-white/5 hover:text-ivory'}`}
                  >
                    Cualquier Pollera
                  </button>
                  {availableTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => { setFilterType(t); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${filterType === t ? 'bg-gold text-background-dark font-bold' : 'text-ivory/60 hover:bg-white/5 hover:text-ivory'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-card-dark/50 px-6 py-4 rounded-full border border-white/5 backdrop-blur-md">
            <ShoppingBag size={18} className="text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-ivory/60">
              {filteredProducts.length} Diseños encontrados
            </span>
          </div>
        </div>

        <div className="w-full">
          {/* Product Grid - More columns for smaller images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center h-96 text-ivory/50">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p className="text-lg">Cargando polleras exclusivas...</p>
              </div>
            ) : error ? (
              <div className="col-span-full bg-red-500/10 border border-red-500/20 p-12 rounded-[2rem] text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-ivory mb-2">Error al cargar el catálogo</h3>
                <p className="text-ivory/60 mb-8 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-primary text-background-dark px-10 py-4 font-bold rounded-xl hover:bg-gold transition-colors shadow-lg"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full bg-card-dark border border-olive/10 p-20 rounded-[3rem] text-center">
                <ShoppingBag className="w-20 h-20 text-gold/20 mx-auto mb-6" />
                <h3 className="text-3xl font-serif font-bold text-ivory mb-4">No se encontraron piezas</h3>
                <p className="text-ivory/60 text-lg mb-10 max-w-md mx-auto">Actualmente no tenemos piezas disponibles en esta categoría. Por favor, explora otras de nuestras colecciones.</p>
                <button
                  onClick={() => setFilterType('ALL')}
                  className="bg-gold text-background-dark px-10 py-4 font-bold rounded-xl hover:bg-primary transition-colors shadow-lg uppercase tracking-widest"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-card-dark rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-gold/5 transition-all duration-500 border border-white/5 flex flex-col items-stretch relative"
                  >
                    {/* Admin Actions Overlay */}
                    {isEditMode && (
                      <div className="absolute top-6 right-6 z-20 flex gap-2">
                        <button
                          onClick={(e) => startEdit(product, e)}
                          className="bg-background-dark/80 backdrop-blur-md p-3 rounded-xl border border-gold/30 text-gold hover:bg-gold hover:text-background-dark transition-all"
                          title="Editar producto"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(product.id, e)}
                          className="bg-background-dark/80 backdrop-blur-md p-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Eliminar producto"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}

                    {/* Image Section - Smaller aspect ratio */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(product.image)}
                        alt={product.name}
                        className={`w-full h-full transition-transform duration-700 group-hover:scale-110`}
                        style={{
                          objectFit: product.image_fit as any || 'cover',
                          objectPosition: product.image_position || 'center'
                        }}
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>

                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-gold text-background-dark px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Exclusivo
                        </span>
                      </div>
                    </div>

                    {/* Content Section - More compact padding */}
                    <div className="p-5 flex flex-col flex-grow bg-card-dark border-t border-white/5">
                      <div className="mb-3">
                        <span className="text-gold font-bold text-[10px] uppercase tracking-widest mb-1 block">{product.type}</span>
                        <h3 className="text-base md:text-lg font-serif font-bold text-ivory group-hover:text-gold transition-colors leading-tight line-clamp-1">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-ivory/60 text-xs mb-4 line-clamp-2 leading-relaxed font-light hidden sm:block">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => setView(View.CONTACT)}
                          className="w-full bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary hover:text-background-dark transition-all active:scale-95 group/btn"
                        >
                          <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
                          <span>Consultar</span>
                        </button>
                      </div>
                    </div>

                    {/* Edit Modal / View */}
                    {editingId === product.id && (
                      <div
                        className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-card-dark w-full max-w-5xl rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh]">
                          {/* Left: Image Preview & Controls */}
                          <div className="md:w-1/2 relative bg-background-dark/50 flex flex-col">
                            <div className="flex-grow relative overflow-hidden bg-checkered">
                              <img
                                src={tempImageUrl}
                                alt="Vista previa"
                                className="w-full h-full"
                                style={{
                                  objectFit: tempImageFit,
                                  objectPosition: tempImagePos
                                }}
                              />
                              <div className="absolute top-6 left-6 right-6 flex justify-between gap-4">
                                <span className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold ring-1 ring-white/20">
                                  Vista Previa
                                </span>
                                <button
                                  onClick={() => setIsUploadModalOpen(true)}
                                  className="bg-gold text-background-dark px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary transition-all flex items-center gap-2 shadow-xl shrink-0"
                                >
                                  <Upload size={14} />
                                  Cambiar Imagen
                                </button>
                              </div>
                            </div>

                            {/* Image Settings Bar */}
                            <div className="p-6 bg-background-dark/80 border-t border-white/5 space-y-4">
                              <div className="flex gap-4">
                                <div className="flex-grow">
                                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2">Ajuste</label>
                                  <select
                                    value={tempImageFit}
                                    onChange={(e) => setTempImageFit(e.target.value as any)}
                                    className="w-full bg-card-dark border-white/10 text-ivory rounded-xl p-3 text-sm focus:ring-1 focus:ring-gold"
                                    title="Ajuste de imagen"
                                  >
                                    <option value="cover">Cubrir (Cover)</option>
                                    <option value="contain">Contener (Contain)</option>
                                  </select>
                                </div>
                                <div className="flex-grow">
                                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2">Posición</label>
                                  <select
                                    value={tempImagePos}
                                    onChange={(e) => setTempImagePos(e.target.value as any)}
                                    className="w-full bg-card-dark border-white/10 text-ivory rounded-xl p-3 text-sm focus:ring-1 focus:ring-gold"
                                    title="Posición de imagen"
                                  >
                                    <option value="center">Centro</option>
                                    <option value="top">Arriba</option>
                                    <option value="bottom">Abajo</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Info Fields */}
                          <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
                            <div className="flex justify-between items-center mb-10">
                              <h2 className="text-3xl font-serif font-bold text-ivory">Editar Producto</h2>
                              <button onClick={cancelEdit} className="text-ivory/40 hover:text-ivory transition-colors">
                                <X size={32} />
                              </button>
                            </div>

                            <div className="space-y-8 flex-grow">
                              <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-3">Nombre del Producto</label>
                                <input
                                  type="text"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="w-full bg-background-dark/50 border-white/10 border-2 rounded-2xl p-5 text-ivory text-xl focus:border-gold transition-all"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-3">Tipo de Pollera</label>
                                  <select
                                    value={tempType}
                                    onChange={(e) => setTempType(e.target.value)}
                                    className="w-full bg-background-dark/50 border-white/10 border-2 rounded-2xl p-5 text-ivory focus:border-gold transition-all"
                                    title="Tipo de pollera"
                                  >
                                    {availableTypes.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                    {!availableTypes.includes(tempType) && <option value={tempType}>{tempType}</option>}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-3">Precio Estimado</label>
                                  <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold font-bold text-xl">$</span>
                                    <input
                                      type="number"
                                      value={tempPrice}
                                      onChange={(e) => setTempPrice(parseFloat(e.target.value))}
                                      className="w-full bg-background-dark/50 border-white/10 border-2 rounded-2xl p-5 pl-10 text-ivory text-xl focus:border-gold transition-all"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-3">Descripción de la Pieza</label>
                                <textarea
                                  value={tempDescription}
                                  onChange={(e) => setTempDescription(e.target.value)}
                                  rows={5}
                                  className="w-full bg-background-dark/50 border-white/10 border-2 rounded-2xl p-5 text-ivory leading-relaxed focus:border-gold transition-all resize-none"
                                />
                              </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                              <button
                                onClick={cancelEdit}
                                className="flex-grow px-8 py-5 rounded-2xl font-bold border border-white/10 text-ivory hover:bg-white/5 transition-all uppercase tracking-widest text-sm"
                              >
                                Descartar Cambios
                              </button>
                              <button
                                onClick={(e) => handleSave(product.id, e)}
                                className="flex-grow px-8 py-5 rounded-2xl font-bold bg-gold text-background-dark hover:bg-primary transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                              >
                                <Save size={20} />
                                Guardar Cambios
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Create New Product Card */}
                {isEditMode && (
                  <div
                    className="bg-card-dark border-2 border-dashed border-olive/30 rounded-[2.5rem] flex items-center justify-center p-8 cursor-pointer hover:border-gold/50 transition-all group min-h-[500px] hover:bg-gold/5"
                    onClick={async () => {
                      const newProduct = {
                        name: 'Nuevo Producto',
                        type: 'Pollera de Gala',
                        price: 0,
                        description: 'Descripción pendiente...',
                        image: '',
                        image_fit: 'cover',
                        image_position: 'center',
                        technique: ''
                      };

                      const { data, error } = await supabase.from('products').insert([newProduct]).select();

                      if (!error && data) {
                        setProducts(prev => [...prev, data[0] as Product]);
                        // Auto-start edit mode for the new product
                        startEdit(data[0] as Product);
                      } else {
                        alert("Error al crear producto: " + error?.message);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-xl">
                        <PlusCircle size={40} />
                      </div>
                      <div className="text-center">
                        <p className="text-ivory font-bold text-xl mb-1">Añadir Nueva Pollera</p>
                        <p className="text-ivory/40 text-sm">Expande tu catálogo exclusivo</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Database Stats for Admins */}
        {isEditMode && (
          <div className="mt-24 p-12 bg-card-dark rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="bg-gold/10 p-5 rounded-3xl border border-gold/20 shadow-inner">
                  <Database className="text-gold w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-ivory">Panel de Control de Datos</h3>
                  <p className="text-ivory/60 mt-1">Supervisión en tiempo real del inventario en Supabase</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-background-dark/50 px-10 py-5 rounded-2xl border border-white/5 text-center shadow-lg">
                  <div className="text-gold text-3xl font-serif font-bold">{products.length}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 mt-1">Productos</div>
                </div>
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="bg-ivory/5 hover:bg-gold/10 text-gold border border-gold/20 px-8 py-5 rounded-2xl font-bold transition-all flex items-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  <PlusCircle size={20} />
                  {seeding ? 'Sincronizando...' : 'Cargar Muestra'}
                </button>
              </div>
            </div>
            {seedError && (
              <p className="mt-6 text-red-400 text-center text-sm font-medium bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                La conexión con la base de datos ha fallado. Por favor, verifica las credenciales de Supabase.
              </p>
            )}
          </div>
        )}
      </div>

      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImageSelect={(url) => {
          setTempImageUrl(url);
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
};
