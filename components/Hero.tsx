
import React from 'react';
import { View } from '../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface HeroProps {
  setView: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  // Using the specific image provided by the user
  const heroImage = "/image/dueñas-5.png";
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover object-top opacity-60"
          src={getOptimizedImageUrl(heroImage, 1920)}
          alt="Detalle de Pollera Panameña y Encajes"
          // @ts-ignore - fetchPriority is a valid attribute in modern browsers but React types might lag
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent"></div>
      </div>

      <div className="relative w-full px-6 md:px-12 lg:px-24 py-24 lg:py-40 flex flex-col justify-center h-full min-h-[700px]">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl">
          Más que Polleras, <br />
          <span className="text-gold italic">una tradición.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-2xl text-gray-200 mb-10 font-light">
          Vive la experiencia completa de lucir una Pollera Panameña. Desde el alquiler de piezas exclusivas hasta el arte del atavío y maquillaje profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => setView(View.CONTACT)}
            className="bg-panamaRed text-white px-10 py-5 rounded-md font-bold text-xl hover:bg-red-700 transition-colors shadow-lg"
          >
            Reserva tu Experiencia
          </button>
          <button
            onClick={() => setView(View.CATALOG)}
            className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-md font-bold text-xl hover:bg-white hover:text-panamaBlue transition-all"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};
