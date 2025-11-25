import React, { useState, useEffect } from 'react';
import { PolleraType, Technique, Product, View } from '../types';
import { Filter, ShoppingBag, Loader2, AlertCircle, Database, PlusCircle, Trash2, Edit, Save } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

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
    description: 'Tradicional pollera Congo de la costa atlántica, llena de retazos, color y vida. Incluye corona.',
    image: 'https://images.unsplash.com/photo-1523974447453-deb40652b04c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    name: 'Pollera Veraguense',
    type: PolleraType.VERAGUENSE,
    technique: Technique.SOMBREADA,
    price: 200.00,
    description: 'Hermosa pollera de la región de Veraguas, caracterizada por sus colores pasteles y elegancia sencilla.',
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
      setError('No se pudieron cargar los productos. Verifica tu conexión a Supabase.');
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta pollera?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error al eliminar producto");
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setTempImageUrl(product.image);
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('products').update({ image: tempImageUrl }).eq('id', id);
    if (!error) {
      setProducts(products.map(p => p.id === id ? { ...p, image: tempImageUrl } : p));
      setEditingId(null);
    } else {
      alert('Error al actualizar imagen');
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
    <div className="bg-white min-h-screen py-16 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900">Catálogo de Alquiler</h2>
            <p className="mt-2 text-xl text-gray-600">Encuentra la indumentaria perfecta para tu próximo evento.</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
             <button onClick={() => setView(View.AI_GENERATOR)} className="text-panamaBlue text-base font-semibold underline hover:text-panamaRed">
                ¿No encuentras lo que buscas? Diseña una idea con IA
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Filters */}
          <div className="lg:col-span-1 bg-offWhite p-8 rounded-lg h-fit sticky top-24 shadow-lg">
            <div className="flex items-center gap-2 mb-6 text-panamaRed font-bold text-xl">
              <Filter size={24} />
              <h3>Filtros</h3>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Tipo de Pollera</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white"
              >
                <option value="ALL">Todas</option>
                {Object.values(PolleraType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Técnica/Labor</label>
              <select 
                value={filterTech} 
                onChange={(e) => setFilterTech(e.target.value as any)}
                className="w-full border-gray-300 rounded-md shadow-sm p-3 bg-white"
              >
                <option value="ALL">Todas</option>
                {Object.values(Technique).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-panamaBlue" />
                <p className="text-lg">Cargando polleras exclusivas...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg p-6">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="font-bold mb-2">Error de Conexión</p>
                <p className="text-center text-sm">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 h-96">
                {products.length === 0 ? (
                  <>
                    <Database className="w-16 h-16 text-gray-300 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Base de Datos Vacía</h3>
                    <p className="text-center text-base max-w-md mb-8">
                      No hay productos en la base de datos de Supabase. Puedes cargar los productos de ejemplo automáticamente.
                    </p>
                    <button 
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="flex items-center bg-panamaBlue text-white px-8 py-4 rounded-lg hover:bg-blue-900 transition-colors text-lg"
                    >
                      {seeding ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                      Cargar Datos de Prueba
                    </button>
                    
                    {seedError && (
                      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-2xl w-full">
                        <div className="flex items-start">
                          <AlertCircle className="text-yellow-600 w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                          <div className="w-full">
                            <p className="font-bold text-yellow-800 text-base mb-2">Permiso Denegado (RLS)</p>
                            <p className="text-sm text-yellow-700 mb-4">
                              Supabase bloquea las inserciones por defecto. Para habilitar este botón, ejecuta este comando en el <strong>SQL Editor</strong> de Supabase:
                            </p>
                            <div className="relative group">
                              <pre className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto font-mono">
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
                      className="mt-4 text-panamaRed font-bold hover:underline text-lg"
                    >
                      Limpiar Filtros
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-white flex flex-col h-full relative group">
                    
                    {isEditMode && (
                      <div className="absolute top-2 left-2 z-20 bg-white/90 p-2 rounded-full shadow-md flex gap-2">
                        {editingId === product.id ? (
                           <button onClick={() => saveEdit(product.id)} className="text-green-600 p-1"><Save size={18} /></button>
                        ) : (
                           <button onClick={() => startEdit(product)} className="text-panamaBlue p-1"><Edit size={18} /></button>
                        )}
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 p-1"><Trash2 size={18} /></button>
                      </div>
                    )}

                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                      {editingId === product.id ? (
                        <div className="absolute inset-0 z-10 bg-white p-6 flex flex-col justify-center">
                            <label className="text-sm font-bold mb-2">URL Nueva Imagen:</label>
                            <textarea 
                              value={tempImageUrl} 
                              onChange={(e) => setTempImageUrl(e.target.value)}
                              className="border p-2 text-xs rounded w-full mb-4 h-24" 
                            />
                             <div className="h-24 bg-gray-50 rounded flex items-center justify-center overflow-hidden border">
                                {tempImageUrl && <img src={tempImageUrl} className="h-full w-full object-cover" alt="Preview"/>}
                             </div>
                        </div>
                      ) : (
                        <img 
                          src={product.image} 
                          onError={handleImageError}
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}
                      
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-gray-800 shadow-sm tracking-wider uppercase">
                        {product.technique}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-panamaRed font-bold uppercase mb-2 tracking-widest">{product.type}</div>
                      <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-3 leading-relaxed">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => setView(View.CONTACT)}
                          className="bg-panamaBlue text-white p-3 rounded-full hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          title="Consultar"
                        >
                          <ShoppingBag size={20} />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400 text-right">
                        *Precio alquiler base
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};