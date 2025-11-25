import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-serif font-bold">
              Tradición<span className="text-panamaRed">Panamá</span>
            </span>
            <p className="text-gray-400 text-sm mt-2">Más que una moda, una tradición.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600 border-t border-gray-800 pt-8">
          © {new Date().getFullYear()} Tradición Panamá. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};