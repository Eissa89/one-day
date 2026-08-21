import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from './translations';
import { loadUserPrefs, saveUserPrefs } from '../utils/storage';

interface I18nContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<'en' | 'ar'>(() => loadUserPrefs().language);

  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Save to prefs
    const prefs = loadUserPrefs();
    saveUserPrefs({ ...prefs, language });
  }, [language]);

  const setLanguage = (lang: 'en' | 'ar') => {
    setLangState(lang);
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    if (key in langDict) {
      return (langDict as Record<string, string>)[key];
    }
    const enDict = translations.en;
    if (key in enDict) {
      return (enDict as Record<string, string>)[key];
    }
    return fallback || key;
  };

  const isRTL = language === 'ar';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
