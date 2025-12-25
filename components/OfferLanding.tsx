import React, { useState } from 'react';
import { View } from '../types';
import { MessageCircle, Star, Check, ArrowRight, Clock, Shield, Heart } from 'lucide-react';

interface OfferLandingProps {
    setView: (view: View) => void;
}

export const OfferLanding: React.FC<OfferLandingProps> = ({ setView }) => {
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const handleWhatsAppClick = (plan: string) => {
        const message = `Hola, estoy interesada en el paquete *${plan}* que vi en su página web. Me gustaría saber disponibilidad.`;
        window.open(`https://wa.me/50769816062?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-background-dark font-sans text-ivory min-h-screen overflow-x-hidden">
            {/* 1. HERO SECTION - The Big Promise (El Vehículo) */}
            <header className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background-dark z-10" />
                    <img
                        src="https://console-varios-minio.fjueze.easypanel.host/api/v1/buckets/bycandashan/objects/download?preview=true&prefix=images%2Fdesfila-de-polleras-2.png&version_id=null"
                        alt="Reina Folklórica"
                        className="w-full h-full object-cover opacity-60 animate-ken-burns"
                    />
                </div>

                <div className="relative z-20 max-w-4xl flex flex-col gap-6 items-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-white drop-shadow-2xl">
                        ¿Lista para el desfile de las Mil Polleras <span className="text-gold">2026</span>? <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold text-3xl md:text-5xl">No vayas solo a mirar. Ve a deslumbrar.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-ivory/80 max-w-2xl font-light leading-relaxed">
                        Este 17 de Enero en Las Tablas, destaca entre las 105 delegaciones. <br />
                        Ofrecemos <strong>servicio completo de alquiler</strong>: Pollera de gala, joyería de lujo, tembleques y maquillaje profesional de larga duración.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                        <button
                            onClick={() => handleWhatsAppClick("Alquiler para Mil Polleras")}
                            className="bg-primary hover:bg-green-600 text-background-dark text-lg font-bold py-4 px-8 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <MessageCircle size={24} />
                            Separar mi Pollera
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('oferta');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/20 text-ivory text-lg font-bold py-4 px-8 rounded-full backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                        >
                            Ver Paquetes 2026
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <p className="text-xs text-ivory/40 mt-4 tracking-wider uppercase font-bold">
                        <span className="text-gold">✦</span> Cupos Limitados por Mes <span className="text-gold">✦</span>
                    </p>
                </div>
            </header>

            {/* 2. PROBLEM/AGITATION - The "Why" */}
            <section className="py-20 px-6 bg-card-dark border-y border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-gold font-bold uppercase tracking-widest text-sm">La Realidad</h2>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                            ¿Por qué conformarte con una foto cuando puedes tener un <span className="text-gold italic">Legado</span>?
                        </h3>
                        <p className="text-ivory/70 text-lg leading-relaxed">
                            En <strong>By Candashian</strong>, nuestro servicio de alquiler no es solo entregarte un vestido. Es prepararte para que seas el centro de todas las miradas con un atavío impecable.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            {[
                                "Joyas Enchapadas en Oro",
                                "Maquillaje Blindado",
                                "Asesoría de Pose",
                                "Atavío sin Dolor"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-ivory/90 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <Check size={14} className="text-primary" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gold/10 rounded-[2rem] blur-2xl"></div>
                        <img
                            src="https://console-varios-minio.fjueze.easypanel.host/api/v1/buckets/bycandashan/objects/download?preview=true&prefix=images%2Fpollera-landing-1.png&version_id=null"
                            alt="Detalle Pollera"
                            className="relative rounded-[2rem] border border-white/10 shadow-2xl w-full object-cover aspect-[4/5]"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-background-dark border border-gold/30 p-6 rounded-2xl shadow-xl max-w-xs">
                            <div className="flex gap-1 text-gold mb-2">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-sm text-ivory/80 italic">"Nunca me había sentido tan hermosa y orgullosa de mis raíces. El trato fue espectacular."</p>
                            <p className="text-xs text-gold font-bold mt-2 uppercase">— Ana Gabriela</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. THE MACHINE (Process) */}
            <section className="py-24 px-6 bg-background-dark relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <h2 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Nuestro Proceso Secreto</h2>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-16">Tu Camino a la Realeza</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Heart size={32} />,
                                title: "1. Preparación de Lujo",
                                desc: "Desde que llegas, te tratamos como reina. Maquillaje profesional y peinado tradicional impecable."
                            },
                            {
                                icon: <Shield size={32} />,
                                title: "2. Atavío Experto",
                                desc: "Nuestras especialistas te visten con técnicas que aseguran comodidad y autenticidad histórica."
                            },
                            {
                                icon: <Star size={32} />,
                                title: "3. La Sesión Soñada",
                                desc: "Te guiamos en cada pose para capturar tu mejor ángulo y la majestuosidad de la pollera."
                            }
                        ].map((step, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-transparent rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform mx-auto">
                                    {step.icon}
                                </div>
                                <h4 className="text-xl font-bold text-ivory mb-3">{step.title}</h4>
                                <p className="text-ivory/60 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. THE OFFER SEXY (Prices/Packages) */}
            <section id="oferta" className="py-24 px-6 bg-gradient-to-b from-background-dark to-black border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20">
                            Oferta Especial Limitada
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-6 mb-6">Paquetes de Alquiler y Estilismo</h2>
                        <p className="text-ivory/60 text-lg max-w-2xl mx-auto">Olvídate de las preocupaciones. Nosotros nos encargamos de que luzcas radiante de principio a fin.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {/* 1. Basic Package */}
                        <div className="bg-card-dark border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all flex flex-col shadow-lg">
                            <h3 className="text-2xl font-bold text-ivory mb-2">Paquete Esencial</h3>
                            <div className="bg-white/5 inline-block px-3 py-1 rounded-lg text-xs font-bold text-ivory/50 uppercase tracking-wider mb-6 self-start">Montuna Tradicional</div>

                            <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-8">
                                <span className="text-5xl font-bold text-gold">$150</span>
                                <span className="text-ivory/40 text-sm">/ sesión</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Alquiler de Pollera Montuna",
                                    "Tembleques de Escamas",
                                    "Maquillaje Básico",
                                    "5 Fotos Digitales Editadas",
                                    "Asistencia de Vestuario"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-ivory/80 text-sm">
                                        <Check size={16} className="text-gold shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleWhatsAppClick("Paquete Esencial")}
                                className="w-full bg-white/10 hover:bg-white/20 text-ivory font-bold py-4 rounded-xl transition-all border border-white/5 mt-auto"
                            >
                                Reservar Ahora
                            </button>
                        </div>

                        {/* 2. INTERMEDIATE PACKAGE (NEW) */}
                        <div className="bg-card-dark border border-gold/20 rounded-[2.5rem] p-8 hover:border-gold/40 transition-all flex flex-col shadow-xl">
                            <h3 className="text-2xl font-bold text-ivory mb-2">Gala Clásica</h3>
                            <div className="bg-gold/5 inline-block px-3 py-1 rounded-lg text-xs font-bold text-gold uppercase tracking-wider mb-6 self-start">Mas Popular</div>

                            <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-8">
                                <span className="text-5xl font-bold text-gold">$275</span>
                                <span className="text-ivory/40 text-sm">/ sesión</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Alquiler de Pollera de Gala",
                                    "Joyería de Plata (Bañada)",
                                    "Maquillaje Profesional",
                                    "10 Fotos Digitales Editadas",
                                    "Asesoría de Atavío Completo",
                                    "Video Clip de 15 seg"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-ivory/80 text-sm">
                                        <Check size={16} className="text-gold shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleWhatsAppClick("Paquete Gala Clásica")}
                                className="w-full bg-gold/10 hover:bg-gold/20 text-gold font-bold py-4 rounded-xl transition-all border border-gold/20 mt-auto"
                            >
                                Reservar Gala
                            </button>
                        </div>

                        {/* 3. VIP Package */}
                        <div className="bg-gradient-to-b from-[#242424] to-black border-2 border-primary rounded-[2.5rem] p-8 relative shadow-2xl shadow-primary/10 flex flex-col transform hover:-translate-y-2 transition-all duration-300">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                                Experiencia Élite
                            </div>

                            <h3 className="text-3xl font-serif font-bold text-white mb-2">Experiencia Reina</h3>
                            <div className="bg-primary/10 inline-block px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase tracking-wider mb-6 self-start">Todo Incluido VIP</div>

                            <div className="flex items-baseline gap-2 mb-8 border-b border-white/10 pb-8">
                                <span className="text-6xl font-bold text-primary">$450</span>
                                <span className="text-ivory/40 text-sm">/ full VIP</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Pollera de Lujo (Gala/Zurcida)",
                                    "Joyería Completa Oro 14k",
                                    "Maquillaje Blindado + Pestañas",
                                    "Sesión de Fotos Ilimitada",
                                    "25 Fotos High-End Retocadas",
                                    "Reel de Video Profesional"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-ivory text-sm font-medium">
                                        <Check size={14} className="text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleWhatsAppClick("Experiencia Reina - VIP")}
                                className="w-full bg-primary hover:bg-[#2ecc71] text-background-dark font-black py-5 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2 mt-auto"
                            >
                                <Star fill="currentColor" size={18} />
                                ¡Quiero Ser Reina!
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FAQ / OBJECTIONS */}
            <section className="py-24 px-6 bg-background-dark border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-center text-white mb-12">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: "¿Necesito llevar mis propios zapatos?", a: "No es necesario si calzas entre 36-39, tenemos babuchas tradicionales disponibles. Si tienes un talla diferente, te asesoramos dónde conseguirlas." },
                            { q: "¿Cuánto tiempo dura toda la experiencia?", a: "Reserva aproximadamente 3 a 4 horas. Queremos que disfrutes cada paso sin prisas, desde el maquillaje hasta el último clic de la cámara." },
                            { q: "¿Puedo llevar acompañantes?", a: "¡Claro que sí! Tu familia puede estar presente durante la sesión para ayudarte y celebrar contigo. Máximo 2 acompañantes por sesión para mantener la comodidad." },
                            { q: "¿Cómo reservo mi fecha?", a: "Para bloquear tu fecha requerimos un abono del 50%. El resto se cancela el día de tu evento. Aceptamos Yappy, Transferencia y Tarjeta de Crédito." }
                        ].map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-card-dark">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-ivory">{faq.q}</span>
                                    <span className={`text-gold text-2xl transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {faqOpen === i && (
                                    <div className="p-6 pt-0 text-ivory/60 leading-relaxed border-t border-white/5 mt-2">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 px-6 bg-primary text-background-dark text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">¿Lista para hacer Historia?</h2>
                    <p className="text-xl md:text-2xl font-medium mb-10 opacity-90 max-w-2xl mx-auto">
                        No dejes pasar otro año diciendo "algún día". Tu momento de reinar es ahora.
                    </p>
                    <button
                        onClick={() => handleWhatsAppClick("Reserva Final CTA")}
                        className="bg-background-dark text-primary hover:text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 border border-background-dark/20"
                    >
                        <MessageCircle size={28} />
                        Hablar con un Experto
                    </button>
                    <p className="mt-6 text-sm opacity-60 font-bold uppercase tracking-widest">
                        Respuesta en menos de 15 minutos
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 text-center text-ivory/30 text-sm border-t border-white/10">
                <p className="mb-4 font-serif text-xl text-ivory/50">By Candashian</p>
                <div className="flex justify-center gap-6 mb-8">
                    <button onClick={() => setView(View.HOME)} className="hover:text-gold transition-colors">Ir al Inicio del Sitio</button>
                    <button onClick={() => setView(View.CONTACT)} className="hover:text-gold transition-colors">Contacto</button>
                </div>
                <p>© {new Date().getFullYear()} Más que Polleras. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};
