import React from 'react';
import { View } from '../types';

interface HeroProps {
  setView: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-60"
          src="http://console-varios-minio.fjueze.easypanel.host/api/v1/download-shared-object/aHR0cHM6Ly92YXJpb3MtbWluaW8uZmp1ZXplLmVhc3lwYW5lbC5ob3N0L2J5Y2FuZGFzaGFuL2ltYWdlcy9wb2xsZXJhLWRlLWdhbGEtc2FudGUlQzMlQjFhLTEucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9SjNQQ0NaUVo3SU45OUM0Uk5NSE8lMkYyMDI1MTEyNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTExMjVUMDExMjEyWiZYLUFtei1FeHBpcmVzPTQzMTk5JlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKS00xQkRRMXBSV2pkSlRqazVRelJTVGsxSVR5SXNJbVY0Y0NJNk1UYzJOREEzTXpFeU9Dd2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLmN5NEZEc3JqMko1U0RRN3d6b29zQ1QwSUNHZDFQT3ZQZUREUHpPTVRFeVlfTmk2U0QxTFpPQkxFOFVSVXRKUE9TZ25PT3BYMTBJY0R3OWV1Y0QzWXJnJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9ZWI1YmEwYmRjNmU4MDQ2MzQ1MDkzY2U4ZTQ2NGVkNTg5MGJhNGRmZGY1ZDEwMDI2MmFjMDNlNDNjNjMxM2E4MQ" 
          alt="Detalle de Pollera Panameña y Encajes"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center h-full min-h-[600px]">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          Más que una moda, <br />
          <span className="text-gold italic">una tradición.</span>
        </h1>
        <p className="mt-4 max-w-xl text-xl text-gray-200 mb-8 font-light">
          Vive la experiencia completa de lucir una Pollera Panameña. Desde el alquiler de piezas exclusivas hasta el arte del atavío y maquillaje profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setView(View.CONTACT)}
            className="bg-panamaRed text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            Reserva tu Experiencia
          </button>
          <button
            onClick={() => setView(View.CATALOG)}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-panamaBlue transition-all"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};