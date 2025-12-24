
import React from 'react';
import { View } from '../types';
import { ArrowRight, Star } from 'lucide-react';

interface OfferLandingMinimalProps {
    setView: (view: View) => void;
}

export const OfferLandingMinimal: React.FC<OfferLandingMinimalProps> = ({ setView }) => {
    return (
        <div className="bg-[#Fdfdfd] text-[#1a1a1a] font-serif min-h-screen selection:bg-black selection:text-white">
            {/* Nav Minimal */}
            <nav className="fixed w-full p-8 flex justify-between items-center z-50 mix-blend-difference text-white">
                <div className="text-xl tracking-widest font-bold uppercase cursor-pointer" onClick={() => setView(View.HOME)}>By Candashian</div>
                <button onClick={() => setView(View.HOME)} className="uppercase text-xs tracking-[0.2em] hover:underline">Exit</button>
            </nav>

            {/* Hero Split */}
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left: Text */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-20 py-24 order-2 lg:order-1 bg-[#Fdfdfd]">
                    <span className="text-xs font-sans font-bold tracking-[0.3em] uppercase mb-6 text-[#8b8b8b]">Mil Polleras 2026</span>
                    <h1 className="text-5xl lg:text-7xl leading-tight mb-8">
                        The Definition of <br />
                        <span className="italic font-light">Panamanian Elegance.</span>
                    </h1>
                    <p className="text-lg font-sans text-gray-500 max-w-md leading-relaxed mb-12">
                        For the upcoming Desfile de las Mil Polleras, don't just participate. Captivate.
                        A curated experience for the discerning woman who values legacy over trends.
                    </p>

                    <div className="flex flex-col gap-4">
                        <button className="flex items-center gap-4 text-xl group w-fit" onClick={() => window.open('https://wa.me/50769816062?text=Reserve%20Minimal', '_blank')}>
                            <span className="border-b border-black pb-1 group-hover:border-transparent transition-all">Reserve for Jan 17</span>
                            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen order-1 lg:order-2 relative overflow-hidden">
                    <img
                        src="/pollera-santena-optimized.jpg"
                        alt="Elegance"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
                    />
                    <div className="absolute bottom-10 right-10 text-white mix-blend-difference font-sans text-xs tracking-widest uppercase">
                        Las Tablas, Pan.
                    </div>
                </div>
            </div>

            {/* Editorial Grid */}
            <section className="py-32 px-6 lg:px-12 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 sticky top-32">
                        <h2 className="text-4xl italic mb-6">The Collection</h2>
                        <p className="font-sans text-gray-500 text-sm leading-relaxed mb-8">
                            Selected pieces from our private atelier, featuring intricate 'Zurcida' and 'Sombreada' techniques.
                            Available exclusively for the 2026 season.
                        </p>
                        <ul className="space-y-4 font-sans text-xs uppercase tracking-widest text-[#1a1a1a]">
                            <li className="flex justify-between border-b py-2"><span>Pollera de Gala</span> <span>01</span></li>
                            <li className="flex justify-between border-b py-2"><span>Pollera Montuna</span> <span>02</span></li>
                            <li className="flex justify-between border-b py-2"><span>Joyería Tradicional</span> <span>03</span></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="aspect-[3/4] bg-[#f0f0f0] overflow-hidden">
                            <img src="/story-craft.jpg" className="w-full h-full object-cover" alt="Detail" />
                        </div>
                        <div className="aspect-[3/4] bg-[#f0f0f0] overflow-hidden md:mt-24">
                            <img src="/story-origin.jpg" className="w-full h-full object-cover" alt="Detail" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal CTA */}
            <section className="py-40 text-center bg-[#1a1a1a] text-white">
                <div className="max-w-2xl mx-auto px-6">
                    <Star className="w-8 h-8 mx-auto mb-8 text-white animate-spin-slow" />
                    <h3 className="text-3xl md:text-5xl italic mb-10">
                        "Elegance is not standing out, but being remembered."
                    </h3>
                    <button
                        onClick={() => window.open('https://wa.me/50769816062?text=I%20wish%20to%20be%20remembered', '_blank')}
                        className="bg-white text-black px-12 py-5 font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                    >
                        Secure Your Appointment
                    </button>
                    <p className="mt-8 font-sans text-xs text-gray-500 uppercase tracking-widest">Limited Availability for Jan 2026</p>
                </div>
            </section>
        </div>
    );
};
