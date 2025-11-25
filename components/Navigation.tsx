import React, { useState } from 'react';
import { View } from '../types';
import { Menu, X, Sparkles, PenTool } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isEditMode, toggleEditMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', value: View.HOME },
    { label: 'Servicios', value: View.SERVICES },
    { label: 'Catálogo', value: View.CATALOG },
    { label: 'Galería', value: View.GALLERY },
    { label: 'Contacto', value: View.CONTACT },
  ];

  const handleNav = (view: View) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav(View.HOME)}>
            <span className="text-2xl font-serif font-bold text-panamaBlue">
              Tradición<span className="text-panamaRed">Panamá</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentView === item.value
                    ? 'text-panamaRed border-b-2 border-panamaRed'
                    : 'text-gray-600 hover:text-panamaBlue'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => handleNav(View.AI_GENERATOR)}
              className="flex items-center space-x-2 bg-gradient-to-r from-panamaBlue to-blue-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:shadow-lg transition-all"
            >
              <Sparkles size={14} className="text-gold" />
              <span>Diseña con IA</span>
            </button>

            <button
              onClick={toggleEditMode}
              className={`p-2 rounded-full transition-colors ${
                isEditMode ? 'bg-panamaRed text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Modo Edición"
            >
              <PenTool size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleEditMode}
              className={`p-2 rounded-full transition-colors ${
                isEditMode ? 'bg-panamaRed text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <PenTool size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-panamaBlue focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === item.value
                    ? 'bg-panamaRed/10 text-panamaRed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
             <button
                onClick={() => handleNav(View.AI_GENERATOR)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-panamaBlue font-bold"
              >
                ✨ Diseña con IA
              </button>
          </div>
        </div>
      )}
      
      {isEditMode && (
        <div className="bg-yellow-100 text-yellow-800 text-xs text-center py-1 font-bold">
          MODO EDICIÓN ACTIVADO: Puedes cambiar imágenes y eliminar elementos.
        </div>
      )}
    </nav>
  );
};