import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

// The 20 languages the user specifically requested to be local
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'ja', name: '日本語' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Filipino / Tagalog' },
];

interface TranslationContextValue {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  isTranslating: false,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useI18nTranslation();

  const setLang = useCallback((newLang: string) => {
    i18n.changeLanguage(newLang);
    const url = new URL(window.location.href);
    if (newLang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', newLang);
    }
    window.history.replaceState({}, '', url.toString());
  }, [i18n]);

  const value = useMemo(() => ({
    lang: i18n.language || 'en',
    setLang,
    t,
    isTranslating: false, // Local translations are instant
  }), [i18n.language, setLang, t]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
