
import React, { useState, useEffect } from 'react';
import { View, ServiceItem } from '../types';
import { Shirt, Gem, Palette, Music, Loader2, Edit, Save, PlusCircle, Camera } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getOptimizedImageUrl, localizeImageUrl } from '../utils/imageUtils';

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
    image: '/image/service-alquiler.jpg'
  },
  {
    title: 'Arreglos y Atavíos',
    description: 'El arte de vestir la pollera. Incluye enjaretado tradicional, colocación experta de joyas y tembleques.',
    icon_name: 'gem',
    cta: 'Ver Galería',
    image: '/image/service-atavio.jpg'
  },
  {
    title: 'Maquillaje y Peinados',
    description: 'Transformación completa. Peinados tradicionales con tembleques y maquillaje resistente para eventos.',
    icon_name: 'palette',
    cta: 'Ver Transformaciones',
    image: '/image/service-makeup.jpg'
  },
  {
    title: 'Presentaciones Folklóricas',
    description: 'Parejas de baile y conjuntos típicos para eventos corporativos y bodas. Cumbia, Tamborito y Punto.',
    icon_name: 'music',
    cta: 'Cotizar Evento',
    image: '/image/service-folk.jpg'
  },
  {
    title: 'Sesión de Fotos',
    description: 'Inmortaliza tu experiencia con fotografía profesional especializada en polleras. Exteriores y estudio.',
    icon_name: 'camera',
    cta: 'Agendar Sesión',
    image: '/image/video-thumb.jpg'
  }
];

export const Services: React.FC<ServicesProps> = ({ setView, isEditMode }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempImageFit, setTempImageFit] = useState<'cover' | 'contain'>('cover');
  const [tempImagePos, setTempImagePos] = useState<'center' | 'top' | 'bottom'>('center');

  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');

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
      case 'shirt': return <Shirt className="w-10 h-10 text-gold" />;
      case 'gem': return <Gem className="w-10 h-10 text-gold" />;
      case 'palette': return <Palette className="w-10 h-10 text-gold" />;
      case 'music': return <Music className="w-10 h-10 text-gold" />;
      case 'camera': return <Camera className="w-10 h-10 text-gold" />;
      default: return <Shirt className="w-10 h-10 text-gold" />;
    }
  };

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setTempImageUrl(localizeImageUrl(service.image));
    setTempImageFit(service.image_fit || 'cover');
    setTempImagePos(service.image_position as any || 'center');
    setTempTitle(service.title);
    setTempDescription(service.description);
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('services').update({
      image: tempImageUrl,
      image_fit: tempImageFit,
      image_position: tempImagePos,
      title: tempTitle,
      description: tempDescription
    }).eq('id', id);

    if (!error) {
      setServices(services.map(s => s.id === id ? {
        ...s,
        image: tempImageUrl,
        image_fit: tempImageFit,
        image_position: tempImagePos,
        title: tempTitle,
        description: tempDescription
      } : s));
      setEditingId(null);
    } else {
      alert('Error al actualizar imagen');
    }
  };

  const addPhotoService = async () => {
    const photoService = {
      title: 'Sesión de Fotos',
      description: 'Inmortaliza tu experiencia con fotografía profesional especializada en polleras. Exteriores y estudio.',
      icon_name: 'camera',
      cta: 'Agendar Sesión',
      image: '/image/service-folk.jpg'
    };

    // Check if checks already exists locally to avoid duplicates visually (optional, but good UX)
    if (services.some(s => s.title === photoService.title)) {
      alert('Este servicio ya existe en la lista.');
      return;
    }

    const { data, error } = await supabase.from('services').insert([photoService]).select();

    if (!error && data) {
      setServices((prev) => [...prev, data[0] as ServiceItem]);
      alert("Servicio agregado exitosamente.");
    } else {
      console.error("Error adding service", error);

      // Fallback: Add locally so the user can see it (even if DB fails)
      const fallbackService = {
        ...photoService,
        id: `temp-${Date.now()}`,
        image_fit: 'cover',
        image_position: 'center'
      } as ServiceItem;

      setServices((prev) => [...prev, fallbackService]);

      alert(`Nota: El servicio se agregó VISUALMENTE, pero hubo un error al guardarlo en la base de datos (${error?.message || 'Error desconocido'}).\n\nSi el error es "Failed to fetch", suele ser un bloqueo de red o falta de permisos RLS en Supabase.`);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/image/service-folk.jpg';
  };

  const getAction = (cta: string) => {
    if (cta.includes('Catálogo')) return () => setView(View.CATALOG);
    if (cta.includes('Galería') || cta.includes('Transformaciones')) return () => setView(View.GALLERY);
    return () => setView(View.CONTACT);
  };

  return (
    <div className="pt-[250px] pb-24 bg-background-dark min-h-screen w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold bg-gold/10 px-4 py-1 rounded-full border border-gold/20 backdrop-blur-sm mb-4 inline-block">
            Excelencia y Tradición
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-ivory">Nuestros Pilares de Servicio</h2>
          <p className="mt-4 text-ivory/70 max-w-3xl mx-auto text-lg font-light">
            Ofrecemos una solución integral para que disfrutes de la cultura panameña sin preocupaciones.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-gold" /></div>
        ) : services.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-ivory/50">No hay servicios cargados.</p>
            <button onClick={handleSeedServices} className="bg-primary text-background-dark px-4 py-2 rounded flex items-center mx-auto gap-2 font-bold hover:bg-gold-light transition-colors">
              <PlusCircle /> Cargar Servicios Iniciales
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 animate-fade-in-up delay-200">
            {services.map((service) => (
              <div key={service.id} className="group bg-card-dark border border-olive/20 rounded-3xl overflow-hidden hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 flex flex-col relative w-full">

                {isEditMode && (
                  <div className="absolute top-2 left-2 z-20 bg-background-dark/90 p-1 rounded-full shadow-md border border-gold/20">
                    {editingId === service.id ? (
                      <button onClick={() => saveEdit(service.id)} className="text-primary p-1"><Save size={16} /></button>
                    ) : (
                      <button onClick={() => startEdit(service)} className="text-gold p-1"><Edit size={16} /></button>
                    )}
                  </div>
                )}

                <div className="h-64 overflow-hidden relative bg-background-dark">
                  {editingId === service.id ? (
                    <div className="absolute inset-0 z-10 bg-card-dark p-4 flex flex-col justify-start shadow-inner overflow-y-auto border-b border-gold/30">
                      <label className="text-[10px] font-bold uppercase text-gold mb-1">URL Imagen</label>
                      <input
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        className="border border-gold/30 p-1 text-xs rounded w-full mb-2 bg-background-dark text-ivory"
                      />

                      <div className="flex gap-2 mb-2">
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold uppercase text-gold mb-1">Ajuste</label>
                          <select
                            value={tempImageFit}
                            onChange={(e: any) => setTempImageFit(e.target.value)}
                            className="border border-gold/30 p-1 text-xs rounded w-full bg-background-dark text-ivory"
                          >
                            <option value="cover">Llenar (Cover)</option>
                            <option value="contain">Completa (Contain)</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] font-bold uppercase text-gold mb-1">Posición</label>
                          <select
                            value={tempImagePos}
                            onChange={(e: any) => setTempImagePos(e.target.value)}
                            className="border border-gold/30 p-1 text-xs rounded w-full bg-background-dark text-ivory"
                          >
                            <option value="center">Centro</option>
                            <option value="top">Arriba</option>
                            <option value="bottom">Abajo</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex-grow bg-background-dark rounded border border-gold/30 flex items-center justify-center overflow-hidden relative">
                        {tempImageUrl && (
                          <img
                            src={getOptimizedImageUrl(tempImageUrl, 300)}
                            className="h-full w-full"
                            style={{ objectFit: tempImageFit, objectPosition: tempImagePos }}
                            alt="Preview"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/50 text-white px-1 rounded">Vista Previa</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gold/10 mix-blend-overlay z-10"></div>
                      <img
                        src={getOptimizedImageUrl(service.image, 600)}
                        onError={handleImageError}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                        style={{
                          objectFit: service.image_fit || 'cover',
                          objectPosition: service.image_position || 'center'
                        }}
                      />
                    </>
                  )}

                  <div className="absolute bottom-4 right-4 bg-background-dark/90 backdrop-blur-md p-3 rounded-full border border-gold/30 z-10 text-gold shadow-lg shadow-black/20">
                    {getIcon(service.icon_name)}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-olive/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                  {editingId === service.id ? (
                    <>
                      <input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="bg-background-dark border border-gold/30 rounded p-1 mb-2 text-xl font-bold font-serif w-full text-ivory placeholder-ivory/50"
                        placeholder="Título del servicio"
                      />
                      <div className="w-10 h-0.5 bg-olive/30 mb-4 transition-all duration-500"></div>
                      <textarea
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        className="bg-background-dark border border-white/10 rounded p-1 mb-6 text-sm text-ivory/80 w-full h-24 resize-none placeholder-ivory/50"
                        placeholder="Descripción..."
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-serif font-medium text-ivory mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                      <div className="w-10 h-0.5 bg-olive/30 mb-4 group-hover:w-full group-hover:bg-gold/50 transition-all duration-500"></div>
                      <p className="text-ivory/60 mb-8 text-sm leading-relaxed flex-grow">{service.description}</p>
                    </>
                  )}
                  <button
                    onClick={getAction(service.cta)}
                    className="w-full mt-auto py-3 border border-gold/30 text-gold rounded-xl font-bold hover:bg-gold hover:text-background-dark transition-all duration-300 uppercase tracking-wider text-xs"
                  >
                    {service.cta}
                  </button>
                </div>
              </div>
            ))}

            {/* Admin Add Button */}
            {isEditMode && services.length > 0 && (
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-olive/30 rounded-3xl hover:border-gold/50 transition-colors cursor-pointer bg-white/5 group" onClick={addPhotoService}>
                <div className="flex flex-col items-center gap-4 text-ivory/50 group-hover:text-gold transition-colors">
                  <div className="bg-olive/20 p-4 rounded-full group-hover:bg-gold/20 transition-colors">
                    <PlusCircle size={32} />
                  </div>
                  <span className="font-bold text-lg uppercase tracking-widest">Agregar "Sesión de Fotos"</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
