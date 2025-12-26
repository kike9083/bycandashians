import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { ArrowRight, Play, Star, ChevronDown, Instagram, Camera, Sparkles } from 'lucide-react';

interface OfferLandingV2Props {
    setView: (view: View) => void;
}

export const OfferLandingV2: React.FC<OfferLandingV2Props> = ({ setView }) => {
    const [scrolled, setScrolled] = useState(false);
    const [activeStory, setActiveStory] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stories = [
        {
            title: "El Origen",
            text: "Cada pieza comienza con un hilo de seda y una promesa: mantener viva nuestra historia.",
            image: "/image/galeria-1.jpg"
        },
        {
            title: "La Maestría",
            text: "Manos artesanas dedican cientos de horas a crear detalles que ninguna máquina podría replicar.",
            image: "/image/galeria-2.jpg"
        },
        {
            title: "Tu Momento",
            text: "No es solo vestirse. Es encarnar la elegancia de mil reinas que vinieron antes que ti.",
            image: "/image/pollera-santena-optimized.jpg"
        }
    ];

    const handleWhatsAppClick = () => {
        const message = "Hola, me ha encantado la historia de By Candashian. Me gustaría agendar una cita para conocer su colección exclusiva.";
        window.open(`https://wa.me/50769816062?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-[#0a0a0a] font-sans text-ivory min-h-screen selection:bg-gold selection:text-black">
            {/* Cinematic Header */}
            <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="text-2xl font-serif tracking-widest text-gold cursor-pointer" onClick={() => setView(View.HOME)}>
                        BC
                    </div>
                    <button
                        onClick={() => setView(View.HOME)}
                        className="text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </nav>

            {/* 1. IMMERSIVE HERO */}
            <header className="relative h-screen w-full overflow-hidden flex flex-col justify-end items-center pb-24 text-center">
                <div className="absolute inset-0">
                    <img
                        src="/image/portada-bg.png"
                        className="w-full h-full object-cover opacity-50 scale-105 animate-ken-burns-slow"
                        alt="Cinematic Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60"></div>
                </div>

                <div className="relative z-10 max-w-4xl px-6 animate-fade-in-up">
                    <p className="text-gold text-sm md:text-base tracking-[0.4em] uppercase mb-4 font-light">Colección 2024</p>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-white mb-6 tracking-tight leading-none">
                        LEGADO<br /><span className="italic font-light text-ivory/80">ETERNO</span>
                    </h1>
                    <p className="text-lg md:text-xl text-ivory/60 max-w-xl mx-auto mb-10 font-light leading-relaxed">
                        Más que una prenda, es una obra de arte viva que respira historia, lujo y tradición.
                    </p>

                    <button
                        onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group flex flex-col items-center gap-2 text-gold/50 hover:text-gold transition-colors duration-500"
                    >
                        <span className="text-xs uppercase tracking-widest">Descubre la Historia</span>
                        <ChevronDown className="animate-bounce" size={24} />
                    </button>
                </div>
            </header>

            {/* 2. SCROLL-TELLING STORY */}
            <section id="story" className="py-32 px-6 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-24">
                            {stories.map((story, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveStory(index)}
                                    className={`cursor-pointer transition-all duration-500 ${activeStory === index ? 'opacity-100 translate-x-4' : 'opacity-30'}`}
                                >
                                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{story.title}</h2>
                                    <p className="text-xl text-ivory/80 font-light leading-relaxed max-w-md border-l border-gold/30 pl-6">
                                        {story.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/5 sticky top-32">
                            {stories.map((story, index) => (
                                <img
                                    key={index}
                                    src={story.image}
                                    alt={story.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeStory === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                                />
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-10 left-10">
                                <span className="text-6xl font-serif text-gold/20 font-bold">0{activeStory + 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CINEMATIC SHOWCASE VIDEO (Placeholder) */}
            <section className="relative py-32 bg-[#0F0F0F] overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px]"></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-5 py-2 mb-8 bg-white/5 backdrop-blur-sm">
                        <Play size={14} className="text-gold fill-gold" />
                        <span className="text-xs font-bold uppercase tracking-widest text-ivory">Ver Film de Campaña</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-16">La Experiencia <span className="text-gold italic">Real</span></h2>

                    <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden group cursor-pointer shadow-2xl border border-white/5">
                        <img
                            src="/image/video-thumb.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                            alt="Video Thumbnail"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                                <Play size={32} className="text-white fill-white ml-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SOFT OFFER / INVITATION */}
            <section className="py-32 px-6 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-[url('/image/portada-bg.png')] bg-fixed bg-cover opacity-10 grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>

                <div className="relative z-10 max-w-3xl space-y-8 p-12 border border-gold/20 bg-black/40 backdrop-blur-md rounded-sm">
                    <Sparkles className="text-gold w-12 h-12 mx-auto mb-4" strokeWidth={1} />
                    <h2 className="text-3xl md:text-5xl font-serif text-white">Una Cita con la Historia</h2>
                    <p className="text-lg text-ivory/70 leading-relaxed font-light">
                        Las verdaderas joyas no se compran con un clic. Se descubren, se sienten y se viven.
                        Te invitamos a una sesión privada donde podrás experimentar la magia de nuestras piezas antes de decidir.
                    </p>

                    <div className="pt-8">
                        <button
                            onClick={handleWhatsAppClick}
                            className="bg-gold text-black hover:bg-white transition-colors duration-300 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]"
                        >
                            Solicitar Cita Privada
                        </button>
                    </div>
                    <p className="text-xs text-ivory/30 uppercase tracking-widest pt-4">Solo 5 citas disponibles esta semana</p>
                </div>
            </section>

            {/* 5. MINIMAL FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-black flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-serif text-gold mb-6">BC</div>
                <div className="flex gap-8 mb-8 text-sm text-ivory/50">
                    <a href="#" className="hover:text-gold transition-colors">Colección</a>
                    <a href="#" className="hover:text-gold transition-colors">Atelier</a>
                    <a href="#" className="hover:text-gold transition-colors">Historias</a>
                </div>
                <p className="text-xs text-ivory/20 uppercase tracking-widest">© By Candashian. All Rights Reserved.</p>
            </footer>
        </div>
    );
};
