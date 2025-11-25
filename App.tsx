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
    <div className="min-h-screen flex flex-col font-sans text-gray-900 w-full overflow-x-hidden">
      <Navigation 
        currentView={activeView} 
        setView={setActiveView} 
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(!isEditMode)}
      />

      <main className="flex-grow w-full">
        {activeView === View.HOME && (
          <>
            <Hero setView={setActiveView} />
            
            <div id="essence" className="bg-white py-24 w-full px-6 md:px-12 lg:px-24 flex flex-col items-center">
              <h3 className="text-3xl font-serif text-gray-800 italic mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-panamaRed after:mx-auto after:mt-4">
                "Nuestra Esencia"
              </h3>
              <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed text-xl text-center font-light">
                La pollera no es solo un vestido, es la identidad de un pueblo tejida a mano. 
                En Tradición Panamá, honramos cada puntada y cada tembleque, asegurando que 
                tu experiencia al portarla sea tan majestuosa como la historia que representa.
              </p>
            </div>

            <Services setView={setActiveView} isEditMode={isEditMode} />
            
            <div className="bg-panamaRed/5 py-24 w-full px-6 md:px-12 lg:px-24 text-center">
              <blockquote className="text-2xl md:text-3xl font-serif text-panamaBlue max-w-5xl mx-auto italic leading-normal">
                "Alquilé el servicio completo para mi boda y fue un sueño. El atavío fue impecable y me sentí una reina. ¡Recomendado!"
                <footer className="mt-6 text-base text-gray-600 not-italic font-sans font-bold tracking-widest uppercase">- María A., Las Tablas</footer>
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