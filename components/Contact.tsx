import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
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
                  <p className="mt-1 text-ivory/60 text-lg">+507 6000-0000</p>
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
                  <p className="mt-1 text-ivory/60 text-lg">Calle 50, Plaza Tradición, Ciudad de Panamá</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button className="flex items-center justify-center w-full sm:w-auto bg-green-600/90 hover:bg-green-600 text-white px-8 py-4 rounded-full transition-colors font-bold shadow-xl shadow-green-900/20 text-lg transform hover:-translate-y-1">
                <MessageSquare className="mr-2" size={24} />
                Chatea con Nosotros
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card-dark rounded-3xl shadow-2xl p-10 lg:p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <h3 className="text-2xl font-serif font-bold text-ivory mb-8 relative z-10">Solicitud de Reserva / Cotización</h3>
            <form className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Nombre Completo</label>
                <input type="text" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Email</label>
                <input type="email" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all" placeholder="correo@ejemplo.com" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Fecha</label>
                  <input type="date" className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Servicio</label>
                  <select className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all">
                    <option>Alquiler de Pollera</option>
                    <option>Maquillaje y Atavío</option>
                    <option>Presentación Folklórica</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Mensaje Adicional</label>
                <textarea rows={4} className="mt-1 block w-full rounded-xl border-white/10 bg-background-dark text-ivory placeholder-ivory/20 shadow-sm focus:border-gold focus:ring focus:ring-gold/20 p-4 border transition-all resize-none" placeholder="Detalles específicos..." />
              </div>
              <button type="button" className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl hover:bg-gold transition-colors shadow-lg shadow-black/30 text-lg mt-4 uppercase tracking-wider">
                Enviar Solicitud
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};