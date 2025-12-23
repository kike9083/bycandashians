import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const services = [
    'Alquiler de Pollera',
    'Maquillaje y Atavío',
    'Presentación Folklórica',
    'Sesión de Fotos',
    'Otro'
  ];

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const form = e.target as any;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone?.value || '';
    const date = form.date.value;
    const messageText = form.message.value;

    // Validar que se haya seleccionado al menos un servicio
    if (selectedServices.length === 0) {
      setMessage({ type: 'error', text: 'Por favor selecciona al menos un servicio.' });
      setSubmitting(false);
      return;
    }

    const servicesText = selectedServices.join(', ');

    try {
      // Guardar en Supabase
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            phone,
            service: servicesText,
            event_date: date || null,
            message: messageText,
            status: 'New'
          }
        ])
        .select();

      if (error) {
        console.error('Error al guardar:', error);
        setMessage({ type: 'error', text: 'Hubo un error al enviar el formulario. Por favor intenta de nuevo.' });
        setSubmitting(false);
        return;
      }

      // Abrir WhatsApp
      const text = `Hola! Me gustaría cotizar un servicio.%0A%0A*Nombre:* ${name}%0A*Teléfono:* ${phone}%0A*Email:* ${email}%0A*Fecha del Evento:* ${date}%0A*Servicios:* ${servicesText}%0A*Descripción:* ${messageText}`;
      window.open(`https://wa.me/50769816062?text=${text}`, '_blank');

      // Limpiar formulario
      form.reset();
      setSelectedServices([]);

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setMessage(null);
      }, 5000);

    } catch (err) {
      console.error('Error inesperado:', err);
      setMessage({ type: 'error', text: 'Hubo un error inesperado. Por favor intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background-dark pt-[250px] pb-24 w-full min-h-screen">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold bg-gold/10 px-4 py-1 rounded-full border border-gold/20 backdrop-blur-sm mb-6 w-fit">
              Atención Exclusiva
            </span>
            <h2 className="text-4xl font-serif font-bold text-ivory mb-8">Contáctanos</h2>
            <p className="text-ivory/60 mb-12 text-lg leading-relaxed font-light">
              ¿Listo para tu experiencia folklórica? Escríbenos para reservar tu cita de prueba o cotizar tu evento.
              Estamos listos para atenderte con la calidez que nos caracteriza.
            </p>

            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-card-dark border border-gold/20 text-gold shadow-lg group-hover:bg-gold group-hover:text-background-dark transition-all duration-300">
                    <Phone size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-ivory group-hover:text-gold transition-colors">Teléfono</h3>
                  <p className="mt-1 text-ivory/60 text-lg">+507 6981-6062</p>
                  <p className="text-ivory/30 text-sm">Lunes a Sábado, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-card-dark border border-gold/20 text-gold shadow-lg group-hover:bg-gold group-hover:text-background-dark transition-all duration-300">
                    <Mail size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-ivory group-hover:text-gold transition-colors">Email</h3>
                  <p className="mt-1 text-ivory/60 text-lg">info@tradicionpanama.com</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-card-dark border border-gold/20 text-gold shadow-lg group-hover:bg-gold group-hover:text-background-dark transition-all duration-300">
                    <MapPin size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-ivory group-hover:text-gold transition-colors">Ubicación</h3>
                  <p className="mt-1 text-ivory/60 text-lg">Ciudad de Panamá</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="https://wa.me/50769816062"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full sm:w-auto bg-green-600/90 hover:bg-green-600 text-white px-8 py-4 rounded-full transition-colors font-bold shadow-xl shadow-green-900/20 text-lg transform hover:-translate-y-1"
              >
                <MessageSquare className="mr-2" size={24} />
                Chatea con Nosotros
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card-dark rounded-3xl shadow-2xl p-10 lg:p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <h3 className="text-2xl font-serif font-bold text-ivory mb-8 relative z-10">Solicitud de Reserva / Cotización</h3>

            {/* Success/Error Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }`}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <form
              className="space-y-6 relative z-10"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Nombre Completo</label>
                <input required name="name" type="text" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Email</label>
                <input required name="email" type="email" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all" placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Teléfono</label>
                <input name="phone" type="tel" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all" placeholder="+507 6xxx-xxxx" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Servicios de Interés *</label>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory shadow-sm focus:border-gold p-4 border transition-all cursor-pointer flex justify-between items-center min-h-[58px]"
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.length === 0 ? (
                      <span className="text-ivory/20 outline-none">Selecciona uno o más servicios</span>
                    ) : (
                      selectedServices.map(s => (
                        <span key={s} className="bg-gold/20 text-gold text-xs px-2 py-1 rounded-md border border-gold/30">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown size={20} className={`text-gold transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {dropdownOpen && (
                  <div className="absolute z-[20] mt-2 w-full bg-card-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="max-h-[250px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {services.map((service) => (
                        <div
                          key={service}
                          onClick={() => toggleService(service)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedServices.includes(service)
                            ? 'bg-gold/10 text-gold'
                            : 'hover:bg-white/5 text-ivory/70'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedServices.includes(service)
                            ? 'bg-gold border-gold'
                            : 'border-white/30'
                            }`}>
                            {selectedServices.includes(service) && (
                              <svg className="w-3 h-3 text-background-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Fecha del Evento</label>
                <input name="date" type="date" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Descripción Detallada</label>
                <textarea name="message" rows={4} className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all resize-none" placeholder="Detalles específicos sobre el evento..." />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl hover:bg-gold transition-colors shadow-lg shadow-black/30 text-lg mt-4 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};