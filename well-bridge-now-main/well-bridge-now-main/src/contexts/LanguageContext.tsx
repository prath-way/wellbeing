import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface CulturalInsight {
  language: string;
  insights: {
    greetings: string[];
    healthConcerns: string[];
    familyInvolvement: string;
    communicationStyle: string;
    dietaryConsiderations: string[];
    religiousConsiderations: string[];
  };
}

interface LanguageContextType {
  currentLanguage: Language;
  availableLanguages: Language[];
  setLanguage: (language: Language) => void;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  getCulturalInsights: (languageCode: string) => CulturalInsight | null;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' }
];

const culturalInsights: CulturalInsight[] = [
  {
    language: 'es',
    insights: {
      greetings: ['Buenos días', 'Buenas tardes', 'Buenas noches'],
      healthConcerns: ['Family health history is very important', 'May prefer same-gender doctors', 'Traditional remedies often used alongside modern medicine'],
      familyInvolvement: 'Family members often accompany patients and participate in health decisions',
      communicationStyle: 'May be more formal initially, prefer personal connection before medical discussion',
      dietaryConsiderations: ['Rice and beans staples', 'Lactose intolerance common', 'Herbal teas for healing'],
      religiousConsiderations: ['Catholic faith may influence health decisions', 'Prayer and spiritual healing important', 'Fasting periods to consider']
    }
  },
  {
    language: 'ar',
    insights: {
      greetings: ['السلام عليكم', 'أهلاً وسهلاً', 'مرحباً'],
      healthConcerns: ['Modesty very important', 'Same-gender healthcare providers preferred', 'Mental health stigma exists'],
      familyInvolvement: 'Male family members may make health decisions for female patients',
      communicationStyle: 'Indirect communication style, may not express pain or discomfort directly',
      dietaryConsiderations: ['Halal dietary restrictions', 'Ramadan fasting considerations', 'No pork or alcohol'],
      religiousConsiderations: ['Prayer times 5x daily', 'Modesty requirements', 'Religious holidays affect scheduling']
    }
  },
  {
    language: 'zh',
    insights: {
      greetings: ['您好', '早上好', '下午好'],
      healthConcerns: ['Traditional Chinese Medicine integration', 'Concept of "face" - may not admit to certain conditions', 'Preventive care highly valued'],
      familyInvolvement: 'Elder family members highly respected in health decisions',
      communicationStyle: 'Indirect communication, may agree to be polite even if not understanding',
      dietaryConsiderations: ['Hot and cold food balance', 'Tea culture important', 'Rice as staple food'],
      religiousConsiderations: ['Ancestor respect', 'Traditional festivals affect availability', 'Feng shui considerations for room placement']
    }
  },
  {
    language: 'hi',
    insights: {
      greetings: ['नमस्ते', 'नमस्कार', 'आदाब'],
      healthConcerns: ['Ayurvedic medicine integration', 'Joint family health decisions', 'Diabetes and heart disease prevalence'],
      familyInvolvement: 'Extended family involvement in major health decisions',
      communicationStyle: 'Respectful, may use titles and formal address',
      dietaryConsiderations: ['Vegetarian options important', 'Spicy food preferences', 'Religious dietary restrictions'],
      religiousConsiderations: ['Multiple religious practices', 'Fasting periods', 'Prayer and meditation important']
    }
  }
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('healthconnect-language');
    if (savedLanguage) {
      const language = availableLanguages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('healthconnect-language', language.code);
  };

  // Mock translation function - In production, this would call Google Translate API
  const translateText = async (text: string, targetLanguage?: string): Promise<string> => {
    const target = targetLanguage || currentLanguage.code;
    
    if (target === 'en') {
      return text; // No translation needed for English
    }

    setIsTranslating(true);

    try {
      // Mock translation - In production, replace with actual Google Translate API call
      // const response = await fetch('/api/translate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, target, source: 'en' })
      // });
      // const data = await response.json();
      // return data.translatedText;

      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock translations for demo
      const mockTranslations: { [key: string]: { [key: string]: string } } = {
        es: {
          'Book Appointment': 'Reservar Cita',
          'Doctor Search': 'Búsqueda de Médicos',
          'My Appointments': 'Mis Citas',
          'Health Records': 'Registros de Salud',
          'Wellness Hub': 'Centro de Bienestar',
          'Community': 'Comunidad',
          'General Medicine': 'Medicina General',
          'Cardiology': 'Cardiología',
          'Ophthalmology': 'Oftalmología',
          'Neurology': 'Neurología',
          'Available today': 'Disponible hoy',
          'Book Now': 'Reservar Ahora'
        },
        fr: {
          'Book Appointment': 'Prendre Rendez-vous',
          'Doctor Search': 'Recherche de Médecins',
          'My Appointments': 'Mes Rendez-vous',
          'Health Records': 'Dossiers de Santé',
          'Wellness Hub': 'Centre de Bien-être',
          'Community': 'Communauté',
          'General Medicine': 'Médecine Générale',
          'Cardiology': 'Cardiologie',
          'Ophthalmology': 'Ophtalmologie',
          'Neurology': 'Neurologie',
          'Available today': 'Disponible aujourd\'hui',
          'Book Now': 'Réserver Maintenant'
        },
        hi: {
          'Book Appointment': 'अपॉइंटमेंट बुक करें',
          'Doctor Search': 'डॉक्टर खोजें',
          'My Appointments': 'मेरी अपॉइंटमेंट्स',
          'Health Records': 'स्वास्थ्य रिकॉर्ड',
          'Wellness Hub': 'वेलनेस हब',
          'Community': 'समुदाय',
          'General Medicine': 'सामान्य चिकित्सा',
          'Cardiology': 'हृदय रोग विज्ञान',
          'Ophthalmology': 'नेत्र विज्ञान',
          'Neurology': 'न्यूरोलॉजी',
          'Available today': 'आज उपलब्ध',
          'Book Now': 'अभी बुक करें'
        }
      };

      const languageTranslations = mockTranslations[target];
      if (languageTranslations && languageTranslations[text]) {
        return languageTranslations[text];
      }

      return `[${target.toUpperCase()}] ${text}`; // Fallback for demo
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };

  const getCulturalInsights = (languageCode: string): CulturalInsight | null => {
    return culturalInsights.find(insight => insight.language === languageCode) || null;
  };

  const value = {
    currentLanguage,
    availableLanguages,
    setLanguage,
    translateText,
    getCulturalInsights,
    isTranslating,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export type { Language, CulturalInsight };
