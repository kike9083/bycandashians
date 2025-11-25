import React, { useState, useEffect } from 'react';
import { View, ServiceItem } from '../types';
import { Shirt, Gem, Palette, Music, Loader2, Edit, Save, PlusCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface ServicesProps {
  setView: (view: View) => void;
  isEditMode: boolean;
}

const SAMPLE_SERVICES = [
  {
    title: 'Alquiler de Indumentaria',
    description: 'Colección exclusiva de Polleras de Gala, Montunas y Congos. Calidad premium desde $150.00.',
    icon_name: 'shirt',
    cta: 'Ver Catálogo',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Arreglos y Atavíos',
    description: 'El arte de vestir la pollera. Incluye enjaretado tradicional, colocación experta de joyas y tembleques.',
    icon_name: 'gem',
    cta: 'Ver Galería',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Maquillaje y Peinados',
    description: 'Transformación completa. Peinados tradicionales con tembleques y maquillaje resistente para eventos.',
    icon_name: 'palette',
    cta: 'Ver Transformaciones',
    image: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Presentaciones Folklóricas',
    description: 'Parejas de baile y conjuntos típicos para eventos corporativos y bodas. Cumbia, Tamborito y Punto.',
    icon_name: 'music',
    cta: 'Cotizar Evento',
    image: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?q=80&w=600&auto=format&fit=crop'
  }
];

export const Services: React.FC<ServicesProps> = ({ setView, isEditMode }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('title');
    if (data) setServices(data as ServiceItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSeedServices = async () => {
    const { error } = await supabase.from('services').insert(SAMPLE_SERVICES);
    if (!error) fetchServices();
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'shirt': return <Shirt className="w-10 h-10 text-panamaRed" />;
      case 'gem': return <Gem className="w-10 h-10 text-gold" />;
      case 'palette': return <Palette className="w-10 h-10 text-panamaBlue" />;
      case 'music': return <Music className="w-10 h-10 text-green-700" />;
      default: return <Shirt className="w-10 h-10" />;
    }
  };

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setTempImageUrl(service.image);
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('services').update({ image: tempImageUrl }).eq('id', id);
    if (!error) {
      setServices(services.map(s => s.id === id ? { ...s, image: tempImageUrl } : s));
      setEditingId(null);
    } else {
      alert('Error al actualizar imagen');
    }
  };

  const getAction = (cta: string) => {
    if (cta.includes('Catálogo')) return () => setView(View.CATALOG);
    if (cta.includes('Galería') || cta.includes('Transformaciones')) return () => setView(View.GALLERY);
    return () => setView(View.CONTACT);
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Nuestros Pilares de Servicio</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una solución integral para que disfrutes de la cultura panameña sin preocupaciones.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-panamaBlue" /></div>
        ) : services.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">No hay servicios cargados.</p>
            <button onClick={handleSeedServices} className="bg-panamaBlue text-white px-4 py-2 rounded flex items-center mx-auto gap-2">
              <PlusCircle /> Cargar Servicios Iniciales
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-offWhite rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
                
                {isEditMode && (
                  <div className="absolute top-2 left-2 z-20 bg-white/90 p-1 rounded-full shadow-md">
                    {editingId === service.id ? (
                      <button onClick={() => saveEdit(service.id)} className="text-green-600 p-1"><Save size={16} /></button>
                    ) : (
                      <button onClick={() => startEdit(service)} className="text-panamaBlue p-1"><Edit size={16} /></button>
                    )}
                  </div>
                )}

                <div className="h-48 overflow-hidden relative">
                   {editingId === service.id ? (
                    <div className="absolute inset-0 z-10 bg-white p-2 flex flex-col justify-center">
                      <label className="text-xs font-bold mb-1">URL Nueva Imagen:</label>
                      <input 
                        value={tempImageUrl} 
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        className="border p-1 text-xs rounded w-full mb-2" 
                      />
                    </div>
                  ) : (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  
                  <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-10">
                      {getIcon(service.icon_name)}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm flex-grow">{service.description}</p>
                  <button
                    onClick={getAction(service.cta)}
                    className="w-full mt-auto py-2 border border-panamaBlue text-panamaBlue rounded font-semibold hover:bg-panamaBlue hover:text-white transition-colors text-sm"
                  >
                    {service.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};