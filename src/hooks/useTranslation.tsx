import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// 100+ languages supported by Google Translate
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'zh', name: 'Chinese' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ny', name: 'Nyanja' },
  { code: 'or', name: 'Odia' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' },
];

// All translatable UI strings
const EN_STRINGS: Record<string, string> = {
  'app.title': 'Goal Momentum Tracker',
  'app.subtitle': 'Track your daily growth signals and build unstoppable momentum.',
  'ring.label': '7-Day Performance Index',
  'ring.nodata': 'Not enough data yet',
  'slider.drive': 'Motivation',
  'slider.drive.desc': 'How driven and motivated do you feel today?',
  'slider.energy': 'Energy Level',
  'slider.energy.desc': 'How energized and ready to go are you today?',
  'slider.focus': 'Focus Quality',
  'slider.focus.desc': 'How sharp and focused is your mind today?',
  'slider.clarity': 'Mental Clarity',
  'slider.clarity.desc': 'How clear and organized are your thoughts today?',
  'slider.impact': 'How much did this move you forward?',
  'slider.impact.desc': 'Rate the impact of your actions today.',
  'action.label': 'Did you make progress toward your goal today?',
  'action.yes': 'Yes, I did',
  'action.no': 'Not today',
  'action.note.label': 'Action Note',
  'action.note.placeholder': 'What did you do today?',
  'blocker.label': "What's slowing your progress?",
  'blocker.placeholder': 'Anything holding you back?',
  'save.save': "Log Today's Progress",
  'save.saved': 'Entry Saved ✓',
  'insights.toggle': 'Goal Insights',
  'insights.trend': '7-Day Trend',
  'insights.drive': 'Motivation',
  'insights.energy': 'Energy Level',
  'insights.focus': 'Focus Quality',
  'insights.clarity': 'Mental Clarity',
  'insights.consistency': 'Action consistency:',
  'insights.days': 'days with meaningful action taken.',
  'insights.multiplier.pre': 'Performance increases',
  'insights.multiplier.post': 'on days you take action.',
  'history.title': 'Entry History',
  'history.toggle': 'Show History',
  'history.nodata': 'No entries yet. Start tracking to build your history.',
  'history.action.yes': 'Progress made',
  'history.action.no': 'No progress',
  'history.blocker': 'Blocker',
  'goal.ask': "This Month's Goal",
  'goal.ask.sub': 'Define a goal you want to track – personal, professional, or anything that matters to you.',
  'goal.placeholder': 'e.g. Improve communication skills, Win an award...',
  'goal.add': 'Add Goal',
  'goal.recent': 'Your Goals',
  'goal.back': 'All Goals',
};

interface TranslationContextValue {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => EN_STRINGS[key] || key,
  isTranslating: false,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang')?.toLowerCase() || 'en';
  const initialLang = LANGUAGES.find(l => l.code.toLowerCase() === urlLang) ? urlLang : 'en';

  const [lang, setLangState] = useState(initialLang);
  const [translations, setTranslations] = useState<Record<string, string>>(EN_STRINGS);
  const [isTranslating, setIsTranslating] = useState(false);
  const cacheRef = useRef<Record<string, Record<string, string>>>({ en: EN_STRINGS });

  const setLang = useCallback((newLang: string) => {
    setLangState(newLang);
    const url = new URL(window.location.href);
    if (newLang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', newLang);
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  useEffect(() => {
    if (lang === 'en') {
      setTranslations(EN_STRINGS);
      return;
    }

    if (cacheRef.current[lang]) {
      setTranslations(cacheRef.current[lang]);
      return;
    }

    const translateAll = async () => {
      setIsTranslating(true);
      try {
        const keys = Object.keys(EN_STRINGS);
        const texts = Object.values(EN_STRINGS);

        const { data, error } = await supabase.functions.invoke('translate', {
          body: { texts, targetLang: lang, sourceLang: 'en' },
        });

        if (error) throw error;

        const translated: Record<string, string> = {};
        keys.forEach((key, i) => {
          translated[key] = data.translations?.[i] || EN_STRINGS[key];
        });

        cacheRef.current[lang] = translated;
        setTranslations(translated);
      } catch (err) {
        console.error('Translation failed:', err);
        setTranslations(EN_STRINGS);
      } finally {
        setIsTranslating(false);
      }
    };

    translateAll();
  }, [lang]);

  const t = useCallback((key: string) => {
    return translations[key] || EN_STRINGS[key] || key;
  }, [translations]);

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
