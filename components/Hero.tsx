
import React from 'react';
import { View } from '../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface HeroProps {
  setView: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  // Using a high-quality Unsplash image as the base to ensure fast loading and optimization availability
  const heroImage = "http://console-varios-minio.fjueze.easypanel.host/api/v1/download-shared-object/aHR0cHM6Ly92YXJpb3MtbWluaW8uZmp1ZXplLmVhc3lwYW5lbC5ob3N0L2J5Y2FuZGFzaGFuL2ltYWdlcy9wb2xsZXJhLWRlLWdhbGEtc2FudGUlQzMlQjFhLTEucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9SjNQQ0NaUVo3SU45OUM0Uk5NSE8lMkYyMDI1MTEyNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTExMjVUMDIzNDQ1WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKS00xQkRRMXBSV2pkSlRqazVRelJTVGsxSVR5SXNJbVY0Y0NJNk1UYzJOREEzTXpFeU9Dd2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLmN5NEZEc3JqMko1U0RRN3d6b29zQ1QwSUNHZDFQT3ZQZUREUHpPTVRFeVlfTmk2U0QxTFpPQkxFOFVSVXRKUE9TZ25PT3BYMTBJY0R3OWV1Y0QzWXJnJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9ODc1YWUwNDgxYjdjZjdlMTRiNmEzODc4NTgxYTUxNWNhNzEyZTc2OTBlM2VlMzlhYjk2YTg4ZjUxYzYwYTAwZA"; 

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
          Más que una moda, <br />
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
