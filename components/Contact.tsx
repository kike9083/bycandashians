import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="bg-offWhite py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Contáctanos</h2>
            <p className="text-gray-600 mb-8">
              ¿Listo para tu experiencia folklórica? Escríbenos para reservar tu cita de prueba o cotizar tu evento.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-panamaBlue text-white">
                    <Phone size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Teléfono</h3>
                  <p className="mt-1 text-gray-600">+507 6000-0000</p>
                  <p className="text-gray-500 text-sm">Lunes a Sábado, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-panamaRed text-white">
                    <Mail size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">info@tradicionpanama.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gold text-white">
                    <MapPin size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Ubicación</h3>
                  <p className="mt-1 text-gray-600">Calle 50, Plaza Tradición, Ciudad de Panamá</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
               <button className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-lg">
                 <MessageSquare className="mr-2" size={20} />
                 Chatea con Nosotros
               </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Solicitud de Reserva / Cotización</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-2 border" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-2 border" placeholder="correo@ejemplo.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Fecha del Evento</label>
                   <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-2 border" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Servicio de Interés</label>
                   <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-2 border">
                     <option>Alquiler de Pollera</option>
                     <option>Maquillaje y Atavío</option>
                     <option>Presentación Folklórica</option>
                     <option>Otro</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mensaje Adicional</label>
                <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panamaBlue focus:ring focus:ring-panamaBlue focus:ring-opacity-50 p-2 border" placeholder="Detalles específicos..." />
              </div>
              <button type="button" className="w-full bg-panamaBlue text-white font-bold py-3 rounded-md hover:bg-blue-900 transition-colors">
                Enviar Solicitud
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};