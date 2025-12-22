import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Edit, Save, Loader2 } from 'lucide-react';

interface HistoryProps {
    isEditMode: boolean;
}

const DEFAULT_TITLE = "Nuestra Historia";
const DEFAULT_CONTENT = `Nacimos del amor por lo nuestro. Tradición Panamá comenzó como un pequeño taller familiar en el corazón de Las Tablas, donde cada puntada contaba una historia. 

Con más de 30 años de experiencia, hemos evolucionado para ofrecer no solo indumentaria, sino una experiencia de lujo que respeta profundamente los cánones del folklore panameño.

Nuestra misión es preservar la esencia de nuestras raíces, elevandolas a los estándares más altos de calidad y elegancia. Cada pieza que confeccionamos o alquilamos lleva consigo el alma de nuestros artesanos y el orgullo de nuestra tierra.`;

export const History: React.FC<HistoryProps> = ({ isEditMode }) => {
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Temp states for editing
    const [tempTitle, setTempTitle] = useState('');
    const [tempContent, setTempContent] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('site_content').select('*');

            if (data && data.length > 0) {
                const titleRow = data.find(r => r.key === 'history_title');
                const contentRow = data.find(r => r.key === 'history_content');

                if (titleRow) setTitle(titleRow.value);
                if (contentRow) setContent(contentRow.value);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = () => {
        setTempTitle(title);
        setTempContent(content);
        setIsEditing(true);
    };

    const saveContent = async () => {
        try {
            // Save Title
            const { error: error1 } = await supabase.from('site_content').upsert({
                key: 'history_title',
                value: tempTitle,
                updated_at: new Date()
            });

            // Save Content
            const { error: error2 } = await supabase.from('site_content').upsert({
                key: 'history_content',
                value: tempContent,
                updated_at: new Date()
            });

            if (error1 || error2) throw new Error("Error saving content");

            setTitle(tempTitle);
            setContent(tempContent);
            setIsEditing(false);
            alert("Historia actualizada correctamente");
        } catch (error: any) {
            console.error(error);
            alert("Error al guardar: " + error.message);
            // Fallback for visual confirmation if DB fails
            setTitle(tempTitle);
            setContent(tempContent);
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-background-dark min-h-screen pt-[150px] pb-24 px-6 md:px-12 lg:px-24 flex items-center justify-center">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Side */}
                <div className="order-2 lg:order-1 relative">
                    {isEditMode && (
                        <div className="absolute -top-12 left-0">
                            {isEditing ? (
                                <button onClick={saveContent} className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2 rounded-full font-bold hover:bg-gold transition-colors">
                                    <Save size={16} /> Guardar Cambios
                                </button>
                            ) : (
                                <button onClick={startEdit} className="flex items-center gap-2 bg-white/10 text-gold px-4 py-2 rounded-full font-bold hover:bg-white/20 transition-colors border border-gold/30">
                                    <Edit size={16} /> Editar Historia
                                </button>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="animate-spin text-gold w-10 h-10" />
                        </div>
                    ) : isEditing ? (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="text-xs font-bold text-gold uppercase mb-1 block">Título</label>
                                <input
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    className="w-full bg-card-dark border border-gold/30 rounded-lg p-3 text-3xl font-serif text-ivory focus:outline-none focus:ring-1 focus:ring-gold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gold uppercase mb-1 block">Contenido</label>
                                <textarea
                                    value={tempContent}
                                    onChange={(e) => setTempContent(e.target.value)}
                                    className="w-full h-96 bg-card-dark border border-gold/30 rounded-lg p-4 text-lg text-ivory/80 leading-relaxed font-light focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Sobre Nosotros</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ivory mb-8 leading-tight">
                                {title}
                            </h2>
                            <div className="space-y-6 text-lg text-ivory/70 font-light leading-relaxed whitespace-pre-line">
                                {content}
                            </div>

                            <div className="mt-12 flex gap-8">
                                <div>
                                    <span className="block text-3xl font-serif text-gold font-bold">30+</span>
                                    <span className="text-xs text-ivory/50 uppercase tracking-widest">Años de Exp.</span>
                                </div>
                                <div>
                                    <span className="block text-3xl font-serif text-gold font-bold">500+</span>
                                    <span className="text-xs text-ivory/50 uppercase tracking-widest">Eventos</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Side */}
                <div className="order-1 lg:order-2 relative group">
                    <div className="absolute inset-0 bg-gold/20 rounded-t-full rounded-b-[10rem] blur-3xl transform rotate-6 opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="relative rounded-t-full rounded-b-[10rem] overflow-hidden border-2 border-white/10 h-[600px] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10 opacity-60"></div>
                        <img
                            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop"
                            alt="Tradición Panameña"
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                        />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-gold/20 rounded-full flex items-center justify-center animate-spin-slow">
                        <div className="w-32 h-32 border border-gold/20 rounded-full border-dashed"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};
