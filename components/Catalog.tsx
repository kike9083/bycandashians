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

  const filteredProducts = products.filter(p => {
    const typeMatch = filterType === 'ALL' || p.type === filterType;
    const techMatch = filterTech === 'ALL' || p.technique === filterTech;
    return typeMatch && techMatch;
  });

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Catálogo de Alquiler</h2>
            <p className="mt-2 text-gray-600">Encuentra la indumentaria perfecta para tu próximo evento.</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
             <button onClick={() => setView(View.AI_GENERATOR)} className="text-panamaBlue text-sm font-semibold underline hover:text-panamaRed">
                ¿No encuentras lo que buscas? Diseña una idea con IA
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1 bg-offWhite p-6 rounded-lg h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-4 text-panamaRed font-bold">
              <Filter size={20} />
              <h3>Filtros</h3>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pollera</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value="ALL">Todas</option>
                {Object.values(PolleraType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Técnica/Labor</label>
              <select 
                value={filterTech} 
                onChange={(e) => setFilterTech(e.target.value as any)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
              >
                <option value="ALL">Todas</option>
                {Object.values(Technique).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-panamaBlue" />
                <p>Cargando polleras exclusivas...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg p-6">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="font-bold mb-2">Error de Conexión</p>
                <p className="text-center text-sm">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-8">
                {products.length === 0 ? (
                  <>
                    <Database className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Base de Datos Vacía</h3>
                    <p className="text-center text-sm max-w-md mb-6">
                      No hay productos en la base de datos de Supabase. Puedes cargar los productos de ejemplo automáticamente.
                    </p>
                    <button 
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="flex items-center bg-panamaBlue text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      {seeding ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                      Cargar Datos de Prueba
                    </button>
                    
                    {seedError && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-lg w-full">
                        <div className="flex items-start">
                          <AlertCircle className="text-yellow-600 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="w-full">
                            <p className="font-bold text-yellow-800 text-sm mb-1">Permiso Denegado (RLS)</p>
                            <p className="text-xs text-yellow-700 mb-3">
                              Supabase bloquea las inserciones por defecto. Para habilitar este botón, ejecuta este comando en el <strong>SQL Editor</strong> de Supabase:
                            </p>
                            <div className="relative group">
                              <pre className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto font-mono">
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
                    <p className="text-lg font-medium">No se encontraron productos con estos filtros.</p>
                    <button 
                      onClick={() => { setFilterType('ALL'); setFilterTech('ALL'); }}
                      className="mt-4 text-panamaRed font-bold hover:underline"
                    >
                      Limpiar Filtros
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col h-full relative">
                    
                    {isEditMode && (
                      <div className="absolute top-2 left-2 z-20 bg-white/90 p-1 rounded-full shadow-md flex gap-2">
                        {editingId === product.id ? (
                           <button onClick={() => saveEdit(product.id)} className="text-green-600 p-1"><Save size={16} /></button>
                        ) : (
                           <button onClick={() => startEdit(product)} className="text-panamaBlue p-1"><Edit size={16} /></button>
                        )}
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 p-1"><Trash2 size={16} /></button>
                      </div>
                    )}

                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 group relative">
                      {editingId === product.id ? (
                        <div className="absolute inset-0 z-10 bg-white p-4 flex flex-col justify-center">
                            <label className="text-xs font-bold mb-1">URL Nueva Imagen:</label>
                            <textarea 
                              value={tempImageUrl} 
                              onChange={(e) => setTempImageUrl(e.target.value)}
                              className="border p-1 text-xs rounded w-full mb-2 h-20" 
                            />
                        </div>
                      ) : (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      )}
                      
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                        {product.technique}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs text-panamaRed font-bold uppercase mb-1">{product.type}</div>
                      <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-4 flex-grow line-clamp-2">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => setView(View.CONTACT)}
                          className="bg-panamaBlue text-white p-2 rounded-full hover:bg-blue-900 transition-colors"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
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