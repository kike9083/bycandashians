import React, { useState, useEffect } from 'react';
import { View } from './types';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Catalog } from './components/Catalog';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { AIGenerator } from './components/AIGenerator';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.HOME);
  const [isEditMode, setIsEditMode] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Navigation 
        currentView={activeView} 
        setView={setActiveView} 
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(!isEditMode)}
      />

      <main className="flex-grow">
        {activeView === View.HOME && (
          <>
            <Hero setView={setActiveView} />
            <div id="essence" className="bg-white py-16 px-4 text-center">
              <h3 className="text-2xl font-serif text-gray-800 italic mb-4">"Nuestra Esencia"</h3>
              <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg">
                La pollera no es solo un vestido, es la identidad de un pueblo tejida a mano. 
                En Tradición Panamá, honramos cada puntada y cada tembleque, asegurando que 
                tu experiencia al portarla sea tan majestuosa como la historia que representa.
              </p>
            </div>
            <Services setView={setActiveView} isEditMode={isEditMode} />
            <div className="bg-panamaRed/5 py-12 text-center">
              <blockquote className="text-xl font-serif text-panamaBlue max-w-2xl mx-auto italic">
                "Alquilé el servicio completo para mi boda y fue un sueño. El atavío fue impecable y me sentí una reina. ¡Recomendado!"
                <footer className="mt-2 text-sm text-gray-600 not-italic font-sans font-bold">- María A., Las Tablas</footer>
              </blockquote>
            </div>
          </>
        )}

        {activeView === View.SERVICES && (
          <Services setView={setActiveView} isEditMode={isEditMode} />
        )}

        {activeView === View.CATALOG && (
          <Catalog setView={setActiveView} isEditMode={isEditMode} />
        )}

        {activeView === View.GALLERY && (
          <Gallery isEditMode={isEditMode} />
        )}

        {activeView === View.CONTACT && (
          <Contact />
        )}

        {activeView === View.AI_GENERATOR && (
          <AIGenerator />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;