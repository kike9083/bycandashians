
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { Calendar, MapPin, Clock, Zap, Ticket, Users } from 'lucide-react';

interface OfferLandingEventProps {
    setView: (view: View) => void;
}

export const OfferLandingEvent: React.FC<OfferLandingEventProps> = ({ setView }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date('2026-01-17T13:00:00'); // Jan 17, 2026, 1:00 PM

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleBooking = (type: string) => {
        const msg = `¡Hola! Quiero separar mi cupo para el ${type} en el Desfile de las Mil Polleras 2026.`;
        window.open(`https://wa.me/50769816062?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="bg-background-dark font-sans text-white min-h-screen">
            {/* Urgent Notification Bar */}
            <div className="bg-olive-dark text-white text-center py-2 text-sm font-bold animate-pulse">
                ⚠️ ¡ÚLTIMOS CUPOS DISPONIBLES PARA LAS TABLAS! ⚠️
            </div>

            {/* Header */}
            <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#ffaa00] cursor-pointer" onClick={() => setView(View.HOME)}>
                    BY CANDASHIAN <span className="text-white/30 ml-2 font-normal not-italic text-sm tracking-normal">| MIL POLLERAS 2026</span>
                </div>
                <button onClick={() => setView(View.HOME)} className="font-bold hover:text-[#ffaa00]">
                    Salir
                </button>
            </header>

            {/* Hero Section */}
            <div className="relative py-12 md:py-24 px-6 text-center overflow-hidden min-h-[80vh] flex flex-col items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background-dark/40 to-background-dark z-10" />
                    <img
                        src="/image/desfila-de-polleras-2.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">

                    <div className="inline-block bg-card-dark border border-gold/30 rounded-full px-4 py-1 mb-8">
                        <span className="text-[#ffaa00] font-bold text-sm tracking-wide">🔥 EL EVENTO DEL AÑO</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
                        BRILLA EN EL DESFILE DE LAS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">1,000 POLLERAS</span>
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 text-lg font-medium text-gray-300">
                        <div className="flex items-center gap-2 justify-center">
                            <Calendar className="text-gold" />
                            <span>Sábado 17 de Enero, 2026</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <Clock className="text-gold" />
                            <span>1:00 P.M.</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <MapPin className="text-gold" />
                            <span>Las Tablas, Los Santos</span>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-3xl mx-auto mb-16">
                        {[
                            { label: 'DÍAS', value: timeLeft.days },
                            { label: 'HRS', value: timeLeft.hours },
                            { label: 'MIN', value: timeLeft.minutes },
                            { label: 'SEG', value: timeLeft.seconds }
                        ].map((item, i) => (
                            <div key={i} className="bg-card-dark border border-gold/20 rounded-xl p-4 md:p-8">
                                <div className="text-3xl md:text-6xl font-black text-white mb-2">{item.value}</div>
                                <div className="text-[10px] md:text-xs font-bold text-gold tracking-widest">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => handleBooking("Pack Delegación VIP")}
                        className="bg-gold hover:bg-gold-light text-background-dark text-xl md:text-2xl font-black py-6 px-12 rounded-full shadow-[0_0_50px_rgba(242,227,198,0.3)] hover:scale-105 transition-all w-full md:w-auto"
                    >
                        ALQUILAR MI ATAVÍO PARA EL 17 DE ENE
                    </button>
                </div>
            </div>

            {/* Homogenized Packages Grid */}
            <section className="py-20 bg-card-dark border-y border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-center mb-16 tracking-tighter">
                        ELIGE TU <span className="text-gold">NIVEL DE BRILLO</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Package 1: Esencial */}
                        <div className="bg-darkest rounded-3xl p-8 border border-white/10 flex flex-col hover:border-gold/30 transition-all">
                            <h3 className="text-xl font-bold mb-2">PACK ESENCIAL</h3>
                            <div className="text-gold text-xs font-black mb-6 uppercase tracking-widest">Montuna Tradicional</div>

                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-5xl font-black">$150</span>
                                <span className="text-gray-500 mb-2">/ evento</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Alquiler de Pollera Montuna",
                                    "Tembleques de Escamas",
                                    "Maquillaje Básico",
                                    "Asistencia de Vestuario",
                                    "Entrega en Las Tablas"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <Zap size={14} className="text-gold" fill="currentColor" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleBooking("Pack Esencial - Evento")}
                                className="w-full border-2 border-gold text-gold hover:bg-gold hover:text-background-dark font-black py-4 rounded-2xl transition-all uppercase"
                            >
                                Reservar Esencial
                            </button>
                        </div>

                        {/* Package 2: Gala Clásica */}
                        <div className="bg-darkest rounded-3xl p-8 border-2 border-[#ffaa00]/30 flex flex-col md:scale-105 shadow-2xl shadow-[#ffaa00]/10 z-10">
                            <div className="bg-[#ffaa00] text-black text-[10px] font-black px-4 py-1 rounded-full self-center mb-4 uppercase tracking-tighter">MÁS SOLICITADO</div>
                            <h3 className="text-2xl font-black mb-2 text-center">GALA CLÁSICA</h3>
                            <div className="text-[#ffaa00] text-xs font-black mb-6 text-center uppercase tracking-widest">Pollera de Lujo</div>

                            <div className="flex justify-center items-end gap-2 mb-8">
                                <span className="text-6xl font-black text-white">$275</span>
                                <span className="text-gray-500 mb-2 ml-2">/ evento</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Alquiler Pollera de Gala",
                                    "Joyería de Plata Bañada",
                                    "Maquillaje Profesional",
                                    "Asesoría de Atavío VIP",
                                    "Maquillaje Blindado (Sol/Calor)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white">
                                        <Zap size={14} className="text-[#ffaa00]" fill="currentColor" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleBooking("Pack Gala Clásica - Evento")}
                                className="w-full bg-[#ffaa00] text-black hover:bg-white font-black py-4 rounded-2xl transition-all uppercase shadow-[0_0_20px_rgba(255,170,0,0.3)]"
                            >
                                ¡LO QUIERO YA!
                            </button>
                        </div>

                        {/* Package 3: Reina del Asfalto (VIP) */}
                        <div className="bg-background-dark rounded-3xl p-8 border border-white/10 flex flex-col hover:border-white/30 transition-all opacity-90">
                            <h3 className="text-xl font-bold mb-2">REINA VIP</h3>
                            <div className="text-white/40 text-xs font-black mb-6 uppercase tracking-widest">Experiencia Full VIP</div>

                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-5xl font-black">$450</span>
                                <span className="text-gray-500 mb-2">/ todo incluido</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {[
                                    "Pollera Gala/Zurcida Lujo",
                                    "Joyería Completa Oro 14k",
                                    "Maquillaje Blindado + Pestañas",
                                    "Atavío por Expertos",
                                    "Sesión de Fotos en Delegación"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                        <Zap size={14} className="text-white" fill="currentColor" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleBooking("Pack Reina VIP - Evento")}
                                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 font-black py-4 rounded-2xl transition-all uppercase"
                            >
                                Reservar VIP
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official Info */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-2xl mx-auto bg-white/5 rounded-2xl p-8 backdrop-blur-sm">
                    <Users className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">¿Vas al Desfile?</h4>
                    <p className="text-gray-400 mb-6">
                        No somos organizadores, somos tus estilistas personales. <br />
                        Prepárate para el evento cultural más grande del año (inicia 1:00 P.M.) con nosotros.
                    </p>
                    <a href="https://www.atp.gob.pa/" target="_blank" rel="noreferrer" className="text-[#ffaa00] underline font-bold hover:text-white">
                        Ver información oficial del evento (ATP)
                    </a>
                </div>
            </section>
        </div>
    );
};
