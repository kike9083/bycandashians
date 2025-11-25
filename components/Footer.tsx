import React from 'react';
import { View } from '../types';

interface FooterProps {
  setView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gold/30 w-full">
      <div className="w-full px-6 md:px-12 lg:px-24 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="text-3xl font-serif font-bold block">
              Tradición<span className="text-panamaRed">Panamá</span>
            </span>
            <p className="text-gray-400 text-base mt-2">Más que una moda, una tradición.</p>
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
          © {new Date().getFullYear()} Tradición Panamá. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};