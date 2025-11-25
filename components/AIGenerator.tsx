import React, { useState } from 'react';
import { generatePolleraImage } from '../services/geminiService';
import { Sparkles, Loader2, Image as ImageIcon, Download } from 'lucide-react';

export const AIGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const result = await generatePolleraImage(prompt);
      if (result) {
        setImage(result);
      } else {
        setError("No se pudo generar la imagen. Intenta con otra descripción o verifica la API key.");
      }
    } catch (err) {
      setError("Error al conectar con el servicio de generación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md mb-4">
             <Sparkles className="text-gold w-8 h-8 mr-2" />
             <span className="text-panamaBlue font-bold text-sm uppercase tracking-wider">Powered by Gemini Nano Banana</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Diseñador Virtual IA</h2>
          <p className="text-gray-600 text-lg">
            Describe la pollera de tus sueños y nuestra inteligencia artificial creará una visualización exclusiva para ti.
            Usa estas imágenes como referencia para tu pedido personalizado.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8 md:p-12">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe tu idea (Color, Región, Labor, Accesorios):
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-4 focus:border-panamaBlue focus:ring-panamaBlue sm:text-sm resize-none"
                    placeholder="Ejemplo: Una pollera de gala santeña con labor zurcida en color turquesa y vino, con mucho lujo en los tembleques de oro y perlas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    Sugerencia: Sé específico con los colores.
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !prompt}
                className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-lg text-base font-medium text-white transition-all
                  ${loading || !prompt ? 'bg-gray-400 cursor-not-allowed' : 'bg-panamaBlue hover:bg-blue-900 shadow-lg hover:shadow-xl'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generando Diseño...
                  </>
                ) : (
                  <>
                    <Sparkles className="-ml-1 mr-3 h-5 w-5" />
                    Generar Imagen
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
             {image ? (
               <div className="relative group max-w-lg w-full">
                 <img src={image} alt="Pollera Generada por IA" className="rounded-lg shadow-2xl w-full" />
                 <a 
                   href={image} 
                   download="mi-diseño-pollera.png"
                   className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Download size={16} /> Descargar
                 </a>
               </div>
             ) : (
               <div className="text-center text-gray-400">
                 {loading ? (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-64 w-64 bg-gray-200 rounded-lg mb-4"></div>
                        <p>La IA está tejiendo tu diseño digital...</p>
                    </div>
                 ) : (
                    <>
                        <ImageIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">Tu diseño aparecerá aquí</p>
                    </>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};