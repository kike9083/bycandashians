
import React, { useState, useRef } from 'react';
import { X, Upload, Check, Loader2, Image as ImageIcon, PlusCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (urls: string[]) => void;
    allowMultiple?: boolean;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    allowMultiple = false
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newFiles = allowMultiple ? [...files, ...selectedFiles] : selectedFiles;
            setFiles(newFiles);

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file as Blob));
            setPreviews(allowMultiple ? [...previews, ...newPreviews] : newPreviews);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Máximo 1600px en el lado más largo
                    const MAX_SIZE = 1600;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Convertir a JPEG con calidad 0.8 (80%)
                    canvas.toBlob(
                        (blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('Canvas to Blob failed'));
                        },
                        'image/jpeg',
                        0.8
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                // Comprimir imagen antes de subir
                const compressedBlob = await compressImage(file);

                // Forzamos extensión .jpg ya que comprimimos a ese formato
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
                const filePath = `uploads/${fileName}`;

                const { data, error } = await supabase.storage
                    .from('bycandashan')
                    .upload(filePath, compressedBlob, {
                        contentType: 'image/jpeg',
                        upsert: true
                    });

                if (error) {
                    console.error('Upload error:', error);
                    throw error;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('bycandashan')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const urls = await Promise.all(uploadPromises);
            onUpload(urls);
            onClose();
            // Reset state
            setFiles([]);
            setPreviews([]);
        } catch (error: any) {
            console.error('Final upload error:', error);
            alert('Error subiendo imágenes: ' + (error.message || 'Verifica que el bucket "bycandashan" exista y tenga permisos públicos.'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card-dark w-full max-w-2xl rounded-3xl border border-gold/20 shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <Upload size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-ivory">Subir Imágenes</h3>
                            <p className="text-xs text-ivory/40 uppercase tracking-widest font-bold">
                                {allowMultiple ? 'Selección múltiple permitida' : 'Selecciona una imagen'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-ivory/50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple={allowMultiple}
                        accept="image/*"
                        className="hidden"
                    />

                    {files.length === 0 ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gold/20 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                <ImageIcon size={32} />
                            </div>
                            <p className="text-ivory/60 font-medium">Haz clic para seleccionar imágenes desde tu carpeta</p>
                            <span className="text-xs text-ivory/30 uppercase tracking-widest">PNG, JPG, WEBP hasta 5MB</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {previews.map((preview, index) => (
                                <div key={preview} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                    <img src={preview} className="w-full h-full object-cover" alt="preview" />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-background-dark/80 backdrop-blur-md rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {allowMultiple && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square border-2 border-dashed border-gold/20 rounded-xl flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/50 cursor-pointer transition-all"
                                >
                                    <PlusCircle size={32} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-background-dark/50 border-t border-white/5 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-ivory/50 hover:text-ivory transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${files.length === 0 || uploading
                            ? 'bg-white/5 text-ivory/20 cursor-not-allowed'
                            : 'bg-primary text-background-dark hover:bg-gold'
                            }`}
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        {uploading ? 'Subiendo...' : `Subir ${files.length} ${files.length === 1 ? 'Imagen' : 'Imágenes'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};
