import React from 'react';
import { View } from '../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface FooterProps {
  setView: (view: View) => void;
}

const LOGO_URL = "http://console-varios-minio.fjueze.easypanel.host/api/v1/download-shared-object/aHR0cHM6Ly92YXJpb3MtbWluaW8uZmp1ZXplLmVhc3lwYW5lbC5ob3N0L2J5Y2FuZGFzaGFuL2ltYWdlcy9sb2dvLXZlY3RvcjkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9NTFUU0xMTlJTWDc3QllTMlNQMTYlMkYyMDI1MTIwMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTEyMDJUMjA1ODMyWiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJMU1WUlRURXhPVWxOWU56ZENXVk15VTFBeE5pSXNJbVY0Y0NJNk1UYzJORGMwTnpBNE9Td2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLk93WkRCVVdRMjVzOTZUR09FOHptaVVucFR0d2RhZFVGSjBfdGNUeFdMMDdINmVPTGlRNlU3WWhodW1YSm9wU0lPMEFwVnJOX0V4aG1BUTNUZUxJRjFRJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9NDg2Y2E5MTcxMjdhZmQ4ZTE3NDcxMjM2MzhiMGRlOWFjNzA0NmRjMzg1OTE4NzBmYzc5NDAxM2U0YjQ5NzYyOQ"
export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gold/30 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <img 
              src={getOptimizedImageUrl(LOGO_URL, 300)} 
              alt="Logo" 
              className="h-16 w-auto object-contain mb-4 md:mb-0"
            />
            <p className="text-gray-400 text-base mt-2">Más que Polleras, una tradición.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <button onClick={() => setView(View.PRIVACY)} className="hover:text-white transition-colors uppercase tracking-wider">
              Política de Privacidad
            </button>
            <button onClick={() => setView(View.TERMS)} className="hover:text-white transition-colors uppercase tracking-wider">
              Términos
            </button>
            <a 
              href="https://www.instagram.com/bycandashians/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors uppercase tracking-wider"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
          © {new Date().getFullYear()} Más que Polleras. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};