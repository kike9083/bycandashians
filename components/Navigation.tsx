import React, { useState } from 'react';
import { View } from '../types';
import { Menu, X, Sparkles, PenTool, Lock, LogOut, Users } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { EditableText } from './EditableText';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  session: Session | null;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isEditMode, toggleEditMode, session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', value: View.HOME, key: 'nav_home' },
    { label: 'Servicios', value: View.SERVICES, key: 'nav_services' },
    { label: 'Catálogo', value: View.CATALOG, key: 'nav_catalog' },
    { label: 'Galería', value: View.GALLERY, key: 'nav_gallery' },
    { label: 'Contacto', value: View.CONTACT, key: 'nav_contact' },
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
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-background-dark/90 backdrop-blur-xl shadow-2xl py-2' : 'bg-gradient-to-b from-background-dark/90 to-transparent py-6'}`}>
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => handleNav(View.HOME)}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/image/logo.png"
                alt="Más que Polleras Logo"
                className={`w-auto object-contain transition-all duration-500 ${scrolled ? 'h-16 md:h-20' : 'h-24 md:h-[200px]'}`}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                title={`Ir a ${item.label}`}
                className={`text-sm font-medium transition-colors duration-200 uppercase tracking-widest ${currentView === item.value
                  ? 'text-gold border-b border-gold'
                  : 'text-ivory/70 hover:text-gold'
                  }`}
              >
                <EditableText
                  contentKey={item.key}
                  defaultText={item.label}
                  isEditMode={!!isEditMode}
                />
              </button>
            ))}



            {/* Auth Controls */}
            {session ? (
              <div className="flex items-center gap-2 border-l pl-4 border-olive/20">
                <button
                  onClick={() => handleNav(View.CRM)}
                  className={`p-2 rounded-full transition-colors ${currentView === View.CRM ? 'text-gold' : 'text-ivory/50 hover:text-ivory'}`}
                  title="CRM / Clientes"
                >
                  <Users size={18} />
                </button>
                <button
                  onClick={toggleEditMode}
                  className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-primary text-background-dark' : 'text-ivory/50 hover:text-ivory'
                    }`}
                  title="Modo Edición"
                >
                  <PenTool size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-ivory/50 hover:text-gold"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav(View.ADMIN_LOGIN)}
                className="p-2 rounded-full text-ivory/30 hover:text-ivory/70"
                title="Acceso Admin"
              >
                <Lock size={16} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {session && (
              <button
                onClick={toggleEditMode}
                className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-primary text-background-dark' : 'text-ivory/50 hover:text-ivory'
                  }`}
                title={isEditMode ? "Desactivar Edición" : "Activar Edición"}
              >
                <PenTool size={18} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ivory hover:text-gold focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background-dark border-t border-olive/20 px-6 absolute top-full left-0 w-full shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-4 pb-6 space-y-2 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors ${currentView === item.value
                  ? 'bg-olive/20 text-gold'
                  : 'text-ivory hover:bg-white/5'
                  }`}
                title={`Ir a ${item.label}`}
              >
                <EditableText
                  contentKey={item.key}
                  defaultText={item.label}
                  isEditMode={!!isEditMode}
                />
              </button>
            ))}


            <div className="border-t border-olive/20 pt-4 mt-4">
              {session ? (
                <>
                  <button
                    onClick={() => handleNav(View.CRM)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 ${currentView === View.CRM ? 'text-gold' : 'text-ivory'}`}
                  >
                    <Users size={16} /> CRM / Clientes
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 font-bold"
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav(View.ADMIN_LOGIN)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-ivory/50"
                >
                  <Lock size={16} /> Acceso Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};
