"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'ro' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Basic translations for key UI elements
const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.poses': 'Pose Library',
    'nav.flows': 'Create Flow',
    'nav.meditation': 'Meditation',
    'nav.manual': 'Manual',
    'nav.business': 'Business',
    'nav.certification': 'Certification',
    'nav.studio': 'Studio',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'hero.title': 'Welcome to Yoga Flow University',
    'hero.subtitle': 'Create personalized yoga flows with intelligent assistance, track your practice, and grow your teaching skills in our comprehensive platform.',
    'cta.start-creating': 'Create Flow',
    'cta.explore-poses': 'Asana Library',
    'cta.try-meditation': 'Try Meditation',
    'footer.made-with-love': 'Made with 💙 for the yoga community',
    'footer.carbon-neutral': 'Carbon neutral hosting'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.poses': 'Asana-Bibliothek',
    'nav.flows': 'Flow Erstellen',
    
    'nav.meditation': 'Meditation',
    'nav.manual': 'Handbuch',
    'nav.business': 'Business',
    'nav.certification': 'Zertifizierung',
    'nav.studio': 'Studio',
    'nav.about': 'Über uns',
    'nav.pricing': 'Preise',
    'nav.contact': 'Kontakt',
    'hero.title': 'Willkommen bei Yoga Flow University',
    'hero.subtitle': 'Erstelle personalisierte Yoga-Flows mit intelligenter Unterstützung, verfolge deine Praxis und entwickle deine Unterrichtsfähigkeiten auf unserer umfassenden Plattform.',
    'cta.start-creating': 'Flow Erstellen',
    'cta.explore-poses': 'Asana-Bibliothek',
    'cta.try-meditation': 'Meditation Ausprobieren',
    'footer.made-with-love': 'Mit 💙 für die Yoga-Gemeinschaft gemacht',
    'footer.carbon-neutral': 'Klimaneutrales Hosting'
  },
  ro: {
    'nav.dashboard': 'Tablou de bord',
    'nav.poses': 'Biblioteca de posturi',
    'nav.flows': 'Creează flux',
    
    'nav.meditation': 'Meditație',
    'nav.manual': 'Manual',
    'nav.business': 'Afaceri',
    'nav.certification': 'Certificare',
    'nav.studio': 'Studio',
    'nav.about': 'Despre noi',
    'nav.pricing': 'Prețuri',
    'nav.contact': 'Contact',
    'hero.title': 'Bun venit la Yoga Flow University',
    'hero.subtitle': 'Creează fluxuri de yoga personalizate cu asistență inteligentă, urmărește-ți practica și dezvoltă-ți abilitățile de predare pe platforma noastră cuprinzătoare.',
    'cta.start-creating': 'Creează flux',
    'cta.explore-poses': 'Biblioteca Asana',
    'cta.try-meditation': 'Încearcă meditația',
    'footer.made-with-love': 'Făcut cu 💙 pentru comunitatea de yoga',
    'footer.carbon-neutral': 'Hosting neutru din punct de vedere al carbonului'
  },
  ru: {
    'nav.dashboard': 'Панель управления',
    'nav.poses': 'Библиотека поз',
    'nav.flows': 'Создать поток',
    
    'nav.meditation': 'Медитация',
    'nav.manual': 'Руководство',
    'nav.business': 'Бизнес',
    'nav.certification': 'Сертификация',
    'nav.studio': 'Студия',
    'nav.about': 'О нас',
    'nav.pricing': 'Цены',
    'nav.contact': 'Контакты',
    'hero.title': 'Добро пожаловать в Yoga Flow University',
    'hero.subtitle': 'Создавайте персонализированные йога-потоки с интеллектуальной помощью, отслеживайте свою практику и развивайте навыки преподавания на нашей комплексной платформе.',
    'cta.start-creating': 'Создать поток',
    'cta.explore-poses': 'Библиотека асан',
    'cta.try-meditation': 'Попробовать медитацию',
    'footer.made-with-love': 'Сделано с 💙 для йога-сообщества',
    'footer.carbon-neutral': 'Углеродно-нейтральный хостинг'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};