import React, { useState } from 'react';
import { View } from '../types';
import { Menu, X, Sparkles, PenTool, Lock, LogOut } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  session: Session | null;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isEditMode, toggleEditMode, session }) => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(View.HOME);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gold/20 w-full">
      <div className="w-full px-6 md:px-12 lg:px-16">
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

            {/* Auth Controls */}
            {session ? (
              <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                <button
                  onClick={toggleEditMode}
                  className={`p-2 rounded-full transition-colors ${
                    isEditMode ? 'bg-panamaRed text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Modo Edición"
                >
                  <PenTool size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-400 hover:text-panamaBlue"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav(View.ADMIN_LOGIN)}
                className="p-2 rounded-full text-gray-300 hover:text-gray-500"
                title="Acceso Admin"
              >
                <Lock size={16} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {session && (
               <button
                  onClick={toggleEditMode}
                  className={`p-2 rounded-full transition-colors ${
                    isEditMode ? 'bg-panamaRed text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <PenTool size={18} />
                </button>
            )}
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
        <div className="md:hidden bg-white border-t border-gray-100 px-6">
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
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                {session ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-600 font-bold"
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav(View.ADMIN_LOGIN)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-400"
                  >
                    <Lock size={16} /> Acceso Admin
                  </button>
                )}
              </div>
          </div>
        </div>
      )}
      
      {isEditMode && session && (
        <div className="bg-yellow-100 text-yellow-800 text-xs text-center py-1 font-bold w-full">
          MODO EDICIÓN ACTIVADO: Puedes cambiar imágenes y eliminar elementos.
        </div>
      )}
    </nav>
  );
};