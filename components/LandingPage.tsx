import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { Lock, LogOut, PenTool } from 'lucide-react';

interface LandingPageProps {
    setView: (view: View) => void;
    session?: Session | null;
    isEditMode?: boolean;
    toggleEditMode?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView, session, isEditMode, toggleEditMode }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setView(View.HOME);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased overflow-x-hidden min-h-screen text-ivory">
            {/* Header - Expert Redesign */}
            <div className={`fixed w-full transition-all duration-500 z-50 ${scrolled ? 'bg-background-dark/80 backdrop-blur-xl py-2 shadow-2xl' : 'bg-gradient-to-b from-background-dark/90 to-transparent py-6'}`}>
                <div className="px-6 md:px-12 flex items-center justify-between max-w-[1920px] mx-auto">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView(View.HOME)}>
                        {/* Logo Container with Glow Effect */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gold/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img
                                src="/logo.png"
                                alt="By Candashian"
                                className={`w-auto object-contain transition-all duration-500 drop-shadow-2xl ${scrolled ? 'h-[120px]' : 'h-[200px]'}`}
                            />
                        </div>
                    </div>

                    {/* Desktop Navigation - Minimalist Luxury */}
                    <div className="hidden md:flex items-center gap-12">
                        <nav className="flex gap-8">
                            {[
                                { label: 'Inicio', view: View.HOME },
                                { label: 'Servicios', view: View.SERVICES },
                                { label: 'Catálogo', view: View.CATALOG },
                                { label: 'Galería', view: View.GALLERY },
                                { label: 'Contacto', view: View.CONTACT }
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    className="relative group py-2"
                                    onClick={() => setView(item.view)}
                                >
                                    <span className="text-ivory text-xs font-bold uppercase tracking-[0.2em] group-hover:text-gold transition-colors duration-300">
                                        {item.label}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300 ease-out"></span>
                                </button>
                            ))}
                        </nav>

                        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                        {/* Admin / CTA Section */}
                        {session ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleEditMode}
                                    className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-primary text-background-dark' : 'text-ivory/50 hover:text-ivory'}`}
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
                                onClick={() => setView(View.ADMIN_LOGIN)}
                                className="p-2 rounded-full text-ivory/30 hover:text-ivory/70 transition-colors"
                                title="Acceso Admin"
                            >
                                <Lock size={16} />
                            </button>
                        )}
                    </div>

                    <button className="md:hidden text-ivory hover:text-gold transition-colors">
                        <span className="material-symbols-outlined text-3xl">menu_open</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center min-h-[85vh] w-full p-4 md:p-8">
                <div className="absolute inset-0 w-full h-full z-0 rounded-b-3xl overflow-hidden">
                    <div className="w-full h-full bg-cover hero-bg"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center max-w-5xl gap-8 mt-16 animate-fade-in-up">
                    <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold bg-gold/5 px-6 py-2 rounded-full border border-gold/10 backdrop-blur-md shadow-lg shadow-gold/5 animate-fade-in delay-200">
                        Folklore de Lujo
                    </span>

                    <p className="text-ivory/90 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto drop-shadow-md text-balance font-serif">
                        Elevando el folklore panameño a un estándar de <span className="text-gold italic">lujo</span> y <span className="text-gold italic">precisión</span>. Descubre por qué somos la elección experta para tus momentos más memorables.
                    </p>
                    <div className="flex flex-col gap-4 mt-8 w-full max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button
                                className="group flex flex-col items-center justify-center rounded-2xl p-6 bg-primary hover:bg-[#2ecc71] text-background-dark font-bold transition-all shadow-xl hover:-translate-y-2"
                                onClick={() => setView(View.OFFER_LANDING)}
                            >
                                <span className="material-symbols-outlined text-3xl mb-2">check_circle</span>
                                <span className="text-lg">Opción 1: Alquiler Premium</span>
                                <span className="text-xs opacity-70 font-normal">Enfoque: Calidad y Tradición</span>
                            </button>

                            <button
                                className="group flex flex-col items-center justify-center rounded-2xl p-6 bg-gradient-to-br from-olive to-gold/80 text-white font-black transition-all shadow-xl hover:-translate-y-2 hover:shadow-olive/50"
                                onClick={() => setView(View.OFFER_EVENT)}
                            >
                                <span className="material-symbols-outlined text-3xl mb-2">bolt</span>
                                <span className="text-lg italic">Opción 2: Promo 2026</span>
                                <span className="text-xs opacity-90 font-bold">Enfoque: Urgencia y Evento</span>
                            </button>
                        </div>
                        <p className="text-center text-ivory/40 text-xs mt-4 uppercase tracking-widest font-bold">Haz Clic para Ver el Diseño</p>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-ivory/30">
                    <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
                </div>
            </div>

            {/* Value Proposition Section */}
            <div className="relative w-full py-20 px-4 md:px-10 bg-cream overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                <div className="max-w-[1200px] mx-auto flex flex-col gap-16 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-olive-dark/10 pb-8">
                        <div className="flex flex-col gap-3 max-w-2xl">
                            <h2 className="text-gold font-sans uppercase tracking-widest text-sm font-bold">Nuestra Propuesta de Valor</h2>
                            <h3 className="text-olive-dark text-4xl md:text-5xl font-serif font-medium leading-tight">
                                Por qué elegirnos
                            </h3>
                        </div>
                        <p className="text-olive-dark/70 text-base md:text-lg max-w-md text-pretty">
                            Fusionamos la alta costura con la tradición más pura para crear piezas que trascienden el tiempo.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="group relative flex flex-col gap-6 p-8 rounded-[2rem] bg-white border border-olive/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-olive/10">
                            <div className="w-14 h-14 rounded-full bg-olive/5 flex items-center justify-center border border-olive/20 group-hover:bg-olive group-hover:text-cream transition-colors duration-500">
                                <span className="material-symbols-outlined text-olive group-hover:text-cream text-2xl">diamond</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-olive-dark text-2xl font-serif font-medium">Experiencia Inigualable</h4>
                                <div className="w-12 h-0.5 bg-gold group-hover:w-full transition-all duration-700"></div>
                                <p className="text-olive-dark/70 text-sm leading-relaxed mt-2">
                                    Años de maestría vistiendo a reinas y empolleradas. Conocemos los secretos de la confección que solo el tiempo y la práctica pueden otorgar.
                                </p>
                            </div>
                        </div>
                        <div className="group relative flex flex-col gap-6 p-8 rounded-[2rem] bg-white border border-olive/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-olive/10">
                            <div className="w-14 h-14 rounded-full bg-olive/5 flex items-center justify-center border border-olive/20 group-hover:bg-olive group-hover:text-cream transition-colors duration-500">
                                <span className="material-symbols-outlined text-olive group-hover:text-cream text-2xl">history_edu</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-olive-dark text-2xl font-serif font-medium">Respeto por la Tradición</h4>
                                <div className="w-12 h-0.5 bg-gold group-hover:w-full transition-all duration-700"></div>
                                <p className="text-olive-dark/70 text-sm leading-relaxed mt-2">
                                    Cada pliegue, cada encaje y cada joya respeta rigurosamente los cánones históricos del folclore panameño, preservando nuestra identidad.
                                </p>
                            </div>
                        </div>
                        <div className="group relative flex flex-col gap-6 p-8 rounded-[2rem] bg-white border border-olive/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-olive/10">
                            <div className="w-14 h-14 rounded-full bg-olive/5 flex items-center justify-center border border-olive/20 group-hover:bg-olive group-hover:text-cream transition-colors duration-500">
                                <span className="material-symbols-outlined text-olive group-hover:text-cream text-2xl">favorite</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-olive-dark text-2xl font-serif font-medium">Atención Personalizada</h4>
                                <div className="w-12 h-0.5 bg-gold group-hover:w-full transition-all duration-700"></div>
                                <p className="text-olive-dark/70 text-sm leading-relaxed mt-2">
                                    Un acompañamiento íntimo y dedicado. Desde la selección de las joyas hasta el maquillaje final, estamos contigo en cada detalle.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-8">
                        <button
                            className="group flex items-center gap-3 px-8 py-4 bg-transparent border border-olive text-olive hover:bg-olive hover:text-cream rounded-full transition-all duration-300"
                            onClick={() => setView(View.SERVICES)}
                        >
                            <span className="font-bold text-lg tracking-wide">Ver Servicios Completos</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Minimal */}
            <div className="w-full bg-[#050807] border-t border-white/5 py-10 px-4 flex flex-col items-center justify-center text-center">
                <h2 className="text-ivory/30 text-2xl font-serif font-bold tracking-wide mb-4">By Candashian</h2>
                <div className="flex gap-4 text-ivory/40">
                    <span className="text-sm">© 2024 Todos los derechos reservados</span>
                </div>
            </div>
        </div>
    );
};
