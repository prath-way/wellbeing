import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface TranslatedTextProps {
  text: string;
  className?: string;
  fallback?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  className = '', 
  fallback,
  as: Component = 'span'
}) => {
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(text);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [text, currentLanguage.code, translateText, fallback]);

  if (isLoading) {
    return (
      <Component className={`inline-flex items-center gap-1 ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="opacity-50">{text}</span>
      </Component>
    );
  }

  return <Component className={className}>{translatedText}</Component>;
};

export default TranslatedText;
