import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="bg-offWhite py-24 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">Contáctanos</h2>
            <p className="text-gray-600 mb-12 text-lg">
              ¿Listo para tu experiencia folklórica? Escríbenos para reservar tu cita de prueba o cotizar tu evento.
              Estamos listos para atenderte con la calidez que nos caracteriza.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-panamaBlue text-white shadow-lg">
                    <Phone size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Teléfono</h3>
                  <p className="mt-1 text-gray-600 text-lg">+507 6000-0000</p>
                  <p className="text-gray-500 text-sm">Lunes a Sábado, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-panamaRed text-white shadow-lg">
                    <Mail size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600 text-lg">info@tradicionpanama.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gold text-white shadow-lg">
                    <MapPin size={24} />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Ubicación</h3>
                  <p className="mt-1 text-gray-600 text-lg">Calle 50, Plaza Tradición, Ciudad de Panamá</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
               <button className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-colors font-bold shadow-xl text-lg transform hover:-translate-y-1">
                 <MessageSquare className="mr-2" size={24} />
                 Chatea con Nosotros
               </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 lg:p-16 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Solicitud de Reserva / Cotización</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Nombre Completo</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-4 border bg-gray-50" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-4 border bg-gray-50" placeholder="correo@ejemplo.com" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Fecha</label>
                   <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-4 border bg-gray-50" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Servicio</label>
                   <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-4 border bg-gray-50">
                     <option>Alquiler de Pollera</option>
                     <option>Maquillaje y Atavío</option>
                     <option>Presentación Folklórica</option>
                     <option>Otro</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Mensaje Adicional</label>
                <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-4 border bg-gray-50" placeholder="Detalles específicos..." />
              </div>
              <button type="button" className="w-full bg-panamaBlue text-white font-bold py-4 rounded-md hover:bg-blue-900 transition-colors shadow-lg text-lg mt-4">
                Enviar Solicitud
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};