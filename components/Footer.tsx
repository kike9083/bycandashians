import React from 'react';
import { View } from '../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface FooterProps {
  setView: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-[#050807] text-white border-t border-olive/20 w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      <div className="w-full px-6 md:px-12 lg:px-24 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <img
              src="/logo.png"
              alt="By Candashian Logo"
              className="h-24 w-auto object-contain mb-4 md:mb-0 grayscale-[50%] hover:grayscale-0 transition-all duration-500"
            />
            <p className="text-ivory/50 text-sm mt-2 font-light tracking-wide">Más que Polleras, una tradición de lujo.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs text-ivory/60">
            <button onClick={() => setView(View.PRIVACY)} className="hover:text-gold transition-colors uppercase tracking-[0.1em]">
              Política de Privacidad
            </button>
            <button onClick={() => setView(View.TERMS)} className="hover:text-gold transition-colors uppercase tracking-[0.1em]">
              Términos
            </button>
            <a
              href="https://www.instagram.com/bycandashians/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors uppercase tracking-[0.1em]"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="mt-12 text-center text-[10px] text-ivory/20 border-t border-white/5 pt-8 uppercase tracking-widest">
          © {new Date().getFullYear()} By Candashian. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};