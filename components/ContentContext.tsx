
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contentService } from '../services/contentService';

interface ContentContextType {
    content: Record<string, string>;
    getContent: (key: string, defaultValue: string) => string;
    updateContent: (key: string, value: string) => Promise<void>;
    isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        const allContent = await contentService.getAllContent();
        setContent(allContent);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const getContent = useCallback((key: string, defaultValue: string) => {
        return content[key] || defaultValue;
    }, [content]);

    const updateContent = useCallback(async (key: string, value: string) => {
        const success = await contentService.updateContent(key, value);
        if (success) {
            setContent(prev => ({ ...prev, [key]: value }));
        }
    }, []);

    return (
        <ContentContext.Provider value={{ content, getContent, updateContent, isLoading }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
