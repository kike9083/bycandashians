
import React, { useState, useEffect } from 'react';
import { PolleraType, Technique, Product, View } from '../types';
import { Filter, ShoppingBag, Loader2, AlertCircle, Database, PlusCircle, Trash2, Edit, Save, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface CatalogProps {
  setView: (view: View) => void;
  isEditMode: boolean;
}

const SAMPLE_PRODUCTS = [
  {
    name: 'Pollera de Gala Santeña',
    type: PolleraType.GALA,
    technique: Technique.ZURCIDA,
    price: 450.00,
    description: 'Exquisita pollera de gala santeña con labores zurcidas y caladas. Incluye joyero completo.',
    image: 'https://images.unsplash.com/photo-1596906660183-f32f319200b3?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Pollera Montuna Santeña',
    type: PolleraType.MONTUNA,
    technique: Technique.MARCADA,
    price: 180.00,
    description: 'Colorida montuna santeña con camisa marcada en punto de cruz y faldón de zaraza floral.',
    image: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Pollera Congo',
    type: PolleraType.CONGO,
    technique: Technique.APLICACION,
    price: 90.00,
    description: 'Tradicional pollera Congo de la Costa Atlántica, llena de retazos, color y vida. Incluye corona.',
    image: 'https://images.unsplash.com/photo-1523974447453-deb40652b04c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Pollera Veragüense',
    type: PolleraType.VERAGUENSE,
    technique: Technique.SOMBREADA,
    price: 200.00,
    description: 'Hermosa pollera de la región de Veraguas, caracterizada por sus tonos pastel y elegancia sencilla.',
    image: 'https://images.unsplash.com/photo-1605289355680-75fbbee5c324?q=80&w=1000&auto=format&fit=crop'
  }
];

export const Catalog: React.FC<CatalogProps> = ({ setView, isEditMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<PolleraType | 'ALL'>('ALL');
  const [filterTech, setFilterTech] = useState<Technique | 'ALL'>('ALL');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempImageFit, setTempImageFit] = useState<'cover' | 'contain'>('cover');
  const [tempImagePos, setTempImagePos] = useState<'center' | 'top' | 'bottom'>('center');

  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempPrice, setTempPrice] = useState(0);

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
    setTempImageUrl(product.image);
    setTempImageFit(product.image_fit || 'cover');
    setTempImagePos(product.image_position as any || 'center');
    setTempName(product.name);
    setTempDescription(product.description);
    setTempPrice(product.price);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setTempImageUrl('');
  };

  const saveEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('products').update({
      image: tempImageUrl,
      image_fit: tempImageFit,
      image_position: tempImagePos,
      name: tempName,
      description: tempDescription,
      price: tempPrice
    }).eq('id', id);

    if (!error) {
      setProducts(products.map(p => p.id === id ? {
        ...p,
        image: tempImageUrl,
        image_fit: tempImageFit,
        image_position: tempImagePos,
        name: tempName,
        description: tempDescription,
        price: tempPrice
      } : p));
      setEditingId(null);
    } else {
      alert('Error al actualizar producto');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1596906660183-f32f319200b3?q=80&w=1000&auto=format&fit=crop'; // Fallback
  };

  const filteredProducts = products.filter(p => {
    const typeMatch = filterType === 'ALL' || p.type === filterType;
    const techMatch = filterTech === 'ALL' || p.technique === filterTech;
    return typeMatch && techMatch;
  });

  return (
    <div className="bg-background-dark min-h-screen pt-[250px] pb-16 w-full text-ivory">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-olive/20 pb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-ivory animate-fade-in-up">Catálogo de Alquiler</h2>
            <p className="mt-2 text-xl text-ivory/60 animate-fade-in-up delay-100">Encuentra la indumentaria perfecta para tu próximo evento.</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Filters */}
          <div className="lg:col-span-1 bg-card-dark p-8 rounded-[2rem] h-fit sticky top-24 border border-olive/10 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-gold font-bold text-xl">
              <Filter size={24} />
              <h3>Filtros</h3>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-ivory/80 mb-2 uppercase tracking-wide">Tipo de Pollera</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full border-olive/30 rounded-xl shadow-sm p-3 bg-background-dark text-ivory focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              >
                <option value="ALL">Todas</option>
                {Object.values(PolleraType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-ivory/80 mb-2 uppercase tracking-wide">Técnica/Labor</label>
              <select
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value as any)}
                className="w-full border-olive/30 rounded-xl shadow-sm p-3 bg-background-dark text-ivory focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              >
                <option value="ALL">Todas</option>
                {Object.values(Technique).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-ivory/50">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p className="text-lg">Cargando polleras exclusivas...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-400 bg-red-900/10 rounded-[2rem] p-6 border border-red-900/30">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="font-bold mb-2">Error de Conexión</p>
                <p className="text-center text-sm">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-ivory/40 bg-card-dark rounded-[2rem] border-2 border-dashed border-olive/10 p-12 h-96">
                {products.length === 0 ? (
                  <>
                    <Database className="w-16 h-16 text-olive/20 mb-6" />
                    <h3 className="text-xl font-bold text-ivory mb-2">Base de Datos Vacía</h3>
                    <p className="text-center text-base max-w-md mb-8">
                      No hay productos en la base de datos de Supabase. Puedes cargar los productos de ejemplo automáticamente.
                    </p>
                    <button
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="flex items-center bg-primary text-background-dark px-8 py-4 rounded-full hover:bg-primary/90 transition-colors text-lg font-bold"
                    >
                      {seeding ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                      Cargar Datos de Prueba
                    </button>

                    {seedError && (
                      <div className="mt-8 p-6 bg-yellow-900/10 border border-yellow-500/30 rounded-xl text-left max-w-2xl w-full">
                        <div className="flex items-start">
                          <AlertCircle className="text-gold w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                          <div className="w-full">
                            <p className="font-bold text-gold text-base mb-2">Permiso Denegado (RLS)</p>
                            <p className="text-sm text-yellow-100/80 mb-4">
                              Supabase bloquea las inserciones por defecto. Para habilitar este botón, ejecuta este comando en el <strong>SQL Editor</strong> de Supabase:
                            </p>
                            <div className="relative group">
                              <pre className="bg-background-dark text-ivory/80 p-4 rounded text-sm overflow-x-auto font-mono border border-olive/20">
                                {`CREATE POLICY "Enable insert for anon" 
ON products 
FOR INSERT 
WITH CHECK (true);`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-xl font-medium">No se encontraron productos con estos filtros.</p>
                    <button
                      onClick={() => { setFilterType('ALL'); setFilterTech('ALL'); }}
                      className="mt-4 text-primary font-bold hover:underline text-lg"
                    >
                      Limpiar Filtros
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 animate-fade-in-up">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-olive/10 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-500 bg-card-dark flex flex-col h-full relative group">

                    {/* Admin Controls */}
                    {isEditMode && (
                      <div className="absolute top-2 left-2 z-20 flex gap-2">
                        {editingId === product.id ? (
                          <div className="flex gap-1 bg-background-dark p-1 rounded-full shadow border border-olive/20">
                            <button onClick={(e) => saveEdit(product.id, e)} className="text-primary p-1 hover:bg-white/5 rounded-full"><Save size={18} /></button>
                            <button onClick={(e) => cancelEdit(e)} className="text-white/50 p-1 hover:bg-white/5 rounded-full"><X size={18} /></button>
                          </div>
                        ) : (
                          <button onClick={(e) => startEdit(product, e)} className="bg-background-dark/90 p-2 rounded-full text-gold shadow-lg hover:bg-white/5 backdrop-blur-sm"><Edit size={18} /></button>
                        )}
                        <button onClick={(e) => handleDelete(product.id, e)} className="bg-background-dark/90 p-2 rounded-full text-red-500 shadow-lg hover:bg-red-900/20 backdrop-blur-sm"><Trash2 size={18} /></button>
                      </div>
                    )}

                    {/* Image Area - Clickable in Edit Mode */}
                    <div
                      className={`aspect-[4/5] overflow-hidden bg-background-dark relative ${isEditMode ? 'cursor-pointer hover:opacity-90 ring-2 ring-transparent hover:ring-primary/50 transition-all' : ''}`}
                      onClick={(e) => isEditMode && !editingId && startEdit(product, e)}
                    >
                      {editingId === product.id ? (
                        <div className="absolute inset-0 z-10 bg-card-dark p-4 flex flex-col justify-between shadow-inner" onClick={e => e.stopPropagation()}>
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] font-bold uppercase text-ivory/50 block mb-1">URL Imagen:</label>
                              <input
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                className="border border-olive/30 p-2 text-xs rounded-md w-full focus:outline-none bg-background-dark text-ivory"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="w-1/2">
                                <label className="text-[10px] font-bold uppercase text-ivory/50 block mb-1">Ajuste:</label>
                                <select
                                  value={tempImageFit}
                                  onChange={(e: any) => setTempImageFit(e.target.value)}
                                  className="border border-olive/30 p-1 text-xs rounded-md w-full bg-background-dark text-ivory"
                                >
                                  <option value="cover">Llenar</option>
                                  <option value="contain">Completa</option>
                                </select>
                              </div>
                              <div className="w-1/2">
                                <label className="text-[10px] font-bold uppercase text-ivory/50 block mb-1">Posición:</label>
                                <select
                                  value={tempImagePos}
                                  onChange={(e: any) => setTempImagePos(e.target.value)}
                                  className="border border-olive/30 p-1 text-xs rounded-md w-full bg-background-dark text-ivory"
                                >
                                  <option value="center">Centro</option>
                                  <option value="top">Arriba</option>
                                  <option value="bottom">Abajo</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="flex-grow bg-background-dark rounded border border-olive/10 flex items-center justify-center overflow-hidden my-2 relative">
                            {tempImageUrl ? (
                              <img
                                src={getOptimizedImageUrl(tempImageUrl, 300)}
                                className="h-full w-full"
                                style={{ objectFit: tempImageFit, objectPosition: tempImagePos }}
                                alt="Preview"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            ) : (
                              <span className="text-xs text-ivory/30">Vista previa</span>
                            )}
                          </div>

                        </div>
                      ) : (
                        <img
                          src={getOptimizedImageUrl(product.image, 500)}
                          onError={handleImageError}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                          style={{
                            objectFit: product.image_fit || 'cover',
                            objectPosition: product.image_position || 'center'
                          }}
                        />
                      )}

                      {isEditMode && !editingId && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <span className="bg-primary text-background-dark px-4 py-2 rounded-full text-xs font-bold shadow-lg transform hover:scale-105 transition-transform">Editar Visualización</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {editingId === product.id ? (
                        <>
                          <input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="bg-background-dark border border-gold/30 rounded p-1 mb-2 text-xl font-bold font-serif w-full text-ivory"
                            placeholder="Título del producto"
                          />
                          <textarea
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            className="bg-background-dark border border-white/10 rounded p-1 mb-2 text-sm text-ivory/80 w-full h-24 resize-none"
                            placeholder="Descripción..."
                          />
                          <div className="mb-6">
                            <label className="text-xs text-ivory/50 font-bold uppercase block mb-1">Precio (USD):</label>
                            <input
                              type="number"
                              step="0.01"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                              className="bg-background-dark border border-white/10 rounded p-2 text-lg font-bold text-gold w-full"
                              placeholder="0.00"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-ivory truncate mb-2 font-serif">{product.name}</h3>
                          <p className="text-sm text-ivory/60 mb-6 flex-grow line-clamp-3 leading-relaxed">{product.description}</p>
                        </>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-olive/10">
                        <span className="text-2xl font-bold text-gold">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => setView(View.CONTACT)}
                          className="bg-primary text-background-dark p-3 rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1"
                          title="Consultar"
                        >
                          <ShoppingBag size={20} />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-olive/40 text-right">
                        *Precio alquiler base
                      </div>
                    </div>
                  </div>
                ))}

                {/* Admin Add Button */}
                {isEditMode && (
                  <div
                    className="bg-card-dark border-2 border-dashed border-olive/30 rounded-[2rem] flex items-center justify-center p-8 cursor-pointer hover:border-gold/50 transition-all group min-h-[400px]"
                    onClick={async () => {
                      const newProduct = {
                        name: 'Nuevo Producto',
                        type: PolleraType.GALA,
                        technique: Technique.ZURCIDA,
                        price: 0,
                        description: 'Descripción pendiente...',
                        image: '',
                        image_fit: 'cover',
                        image_position: 'center'
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
                    <div className="flex flex-col items-center gap-4 text-ivory/50 group-hover:text-gold transition-colors">
                      <div className="bg-olive/20 p-6 rounded-full group-hover:bg-gold/20 transition-colors">
                        <PlusCircle size={48} />
                      </div>
                      <span className="font-bold text-xl uppercase tracking-widest text-center">Agregar Producto</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
