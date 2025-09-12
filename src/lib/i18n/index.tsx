"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export type SupportedLanguage = 'en' | 'de' | 'ro' | 'ru';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface Translations {
  [key: string]: string | Translations;
}

// Detect browser language and map to supported languages
const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: SupportedLanguage[] = ['en', 'de', 'ro', 'ru'];
  
  return supportedLanguages.includes(browserLang as SupportedLanguage) 
    ? (browserLang as SupportedLanguage) 
    : 'en';
};

// Simple placeholder translations
const translations: Record<SupportedLanguage, Translations> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      poses: 'Pose Library',
      create: 'Create Flow',
      meditation: 'Meditation',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Try Again',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
    meditation: {
      title: 'Meditation Center',
      description: 'Find inner peace and enhance your yoga practice',
      startSession: 'Start Session',
      customTimer: 'Custom Timer',
      minutes: 'minutes',
    },
  },
  de: {
    nav: {
      dashboard: 'Dashboard',
      poses: 'Posen-Bibliothek',
      create: 'Flow Erstellen',
      meditation: 'Meditation',
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      retry: 'Erneut Versuchen',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
    },
    meditation: {
      title: 'Meditations-Zentrum',
      description: 'Finde inneren Frieden und verbessere deine Yoga-Praxis',
      startSession: 'Sitzung Starten',
      customTimer: 'Eigener Timer',
      minutes: 'Minuten',
    },
  },
  ro: {
    nav: {
      dashboard: 'Tablou de Bord',
      poses: 'Biblioteca de Pozitii',
      create: 'Creaza Flow',
      meditation: 'Meditatie',
    },
    common: {
      loading: 'Se încarcă...',
      error: 'Eroare',
      retry: 'Încearcă Din Nou',
      cancel: 'Anulează',
      save: 'Salvează',
      delete: 'Șterge',
      edit: 'Editează',
    },
    meditation: {
      title: 'Centrul de Meditație',
      description: 'Găsește pacea interioară și îmbunătățește practica de yoga',
      startSession: 'Începe Sesiunea',
      customTimer: 'Timer Personalizat',
      minutes: 'minute',
    },
  },
  ru: {
    nav: {
      dashboard: 'Панель',
      poses: 'Библиотека Поз',
      create: 'Создать Поток',
      meditation: 'Медитация',
    },
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      retry: 'Попробовать Снова',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
    },
    meditation: {
      title: 'Центр Медитации',
      description: 'Найдите внутренний покой и улучшите практику йоги',
      startSession: 'Начать Сеанс',
      customTimer: 'Пользовательский Таймер',
      minutes: 'минут',
    },
  },
};

// Get nested translation value
const getNestedTranslation = (obj: Translations, key: string): string => {
  const keys = key.split('.');
  let current: any = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof current === 'string' ? current : key;
};

// Replace placeholders in translation strings
const replacePlaceholders = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  
  return Object.entries(params).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, text);
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language preference from localStorage or detect browser language
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    const detectedLanguage = detectBrowserLanguage();
    
    const initialLanguage = savedLanguage || detectedLanguage;
    setLanguage(initialLanguage);
    setIsLoading(false);
  }, []);

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedTranslation(translations[language], key);
    return replacePlaceholders(translation, params);
  };

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isLoading,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Helper hook for language-specific formatting
export const useFormatter = () => {
  const { language } = useI18n();
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : language).format(num);
  };
  
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const locale = language === 'en' ? 'en-US' : language;
    return new Intl.DateTimeFormat(locale, options).format(date);
  };
  
  const formatRelativeTime = (date: Date): string => {
    const locale = language === 'en' ? 'en-US' : language;
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
    } else {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
    }
  };
  
  return {
    formatNumber,
    formatDate,
    formatRelativeTime,
  };
};