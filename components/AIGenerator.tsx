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
    <div className="bg-background-dark min-h-screen pt-[250px] pb-16 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-card-dark border border-gold/20 rounded-full shadow-lg shadow-gold/5 mb-4 backdrop-blur-sm">
            <Sparkles className="text-gold w-6 h-6 mr-2" />
            <span className="text-gold font-bold text-xs uppercase tracking-[0.2em]">Powered by Gemini Nano Banana</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-ivory mb-6">Diseñador Virtual IA</h2>
          <p className="text-ivory/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Describe la pollera de tus sueños y nuestra inteligencia artificial creará una visualización exclusiva para ti.
            Usa estas imágenes como referencia para tu pedido personalizado.
          </p>
        </div>

        <div className="bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
          <div className="p-8 md:p-12">
            <form onSubmit={handleGenerate} className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-3">
                  Describe tu idea (Color, Región, Labor, Accesorios):
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-olive/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <textarea
                    rows={4}
                    className="relative block w-full rounded-xl border-white/10 bg-background-dark p-4 focus:border-gold focus:ring focus:ring-gold/20 sm:text-sm resize-none text-ivory placeholder-ivory/20 transition-all"
                    placeholder="Ejemplo: Una pollera de gala santeña con labor zurcida en color turquesa y vino, con mucho lujo en los tembleques de oro y perlas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-ivory/30 uppercase tracking-wider font-bold">
                    Sugerencia: Sé específico con los colores.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt}
                className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl text-sm font-bold uppercase tracking-widest transition-all
                  ${loading || !prompt ? 'bg-white/5 text-ivory/20 cursor-not-allowed' : 'bg-gold text-background-dark hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5'}`}
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
              <div className="mt-8 p-4 bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-background-dark/50 border-t border-white/5 p-8 flex flex-col items-center justify-center min-h-[400px] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            {image ? (
              <div className="relative group max-w-lg w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold via-olive to-gold rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <img src={image} alt="Pollera Generada por IA" className="relative rounded-lg shadow-2xl w-full border border-white/10" />
                <a
                  href={image}
                  download="mi-diseño-pollera.png"
                  className="absolute bottom-4 right-4 bg-background-dark/90 backdrop-blur text-gold border border-gold/30 px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-background-dark transform hover:-translate-y-1"
                >
                  <Download size={16} /> <span className="text-xs uppercase tracking-wider">Descargar</span>
                </a>
              </div>
            ) : (
              <div className="text-center text-ivory/20">
                {loading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-64 w-64 bg-white/5 rounded-2xl mb-6 shadow-inner border border-white/5"></div>
                    <p className="text-gold/70 text-sm uppercase tracking-widest animate-pulse">La IA está tejiendo tu diseño digital...</p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-24 w-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <ImageIcon className="h-10 w-10 opacity-50" />
                    </div>
                    <p className="text-lg font-serif italic text-ivory/40">Tu diseño aparecerá aquí</p>
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