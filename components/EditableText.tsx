
import React, { useState, useEffect, useRef } from 'react';
import { useContent } from './ContentContext';
import { Check, X, Pencil } from 'lucide-react';

interface EditableTextProps {
    contentKey: string;
    defaultText: string;
    isEditMode: boolean;
    className?: string;
    multiline?: boolean;
    as?: React.ElementType;
}

export const EditableText: React.FC<EditableTextProps> = ({
    contentKey,
    defaultText,
    isEditMode,
    className = '',
    multiline = false,
    as: Component = 'span'
}) => {
    const { getContent, updateContent } = useContent();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const text = getContent(contentKey, defaultText);

    useEffect(() => {
        setValue(text);
    }, [text]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = async (e?: React.MouseEvent | React.FormEvent) => {
        e?.preventDefault();
        if (value === text) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        await updateContent(contentKey, value);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setValue(text);
        setIsEditing(false);
    };

    if (!isEditMode) {
        return <Component className={className}>{text}</Component>;
    }

    if (isEditing) {
        return (
            <div className={`relative group/edit ${className}`}>
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        aria-label={`Editar ${contentKey}`}
                        title="Editar texto"
                        className="w-full bg-black/10 dark:bg-white/10 border-2 border-gold rounded p-2 focus:outline-none focus:ring-2 focus:ring-gold min-h-[100px]"
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        aria-label={`Editar ${contentKey}`}
                        title="Editar texto"
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-full bg-black/10 dark:bg-white/10 border-2 border-gold rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                )}
                <div className="absolute right-2 top-2 flex gap-1 z-10">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        aria-label="Guardar"
                        title="Guardar"
                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        aria-label="Cancelar"
                        title="Cancelar"
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative group/edit cursor-pointer border border-transparent hover:border-gold/50 hover:bg-gold/5 rounded transition-all ${className}`}
            onClick={() => setIsEditing(true)}
        >
            <Component>{text}</Component>
            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                <Pencil size={14} className="text-gold" />
            </div>
        </div>
    );
};
