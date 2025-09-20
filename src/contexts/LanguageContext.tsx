"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'ro' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Comprehensive translations for all pages
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
    'footer.carbon-neutral': 'Carbon neutral hosting',
    
    // Manual translations
    'manual.title': 'YogaFlow 200-Hour Teacher Training Manual',
    'manual.back-to-home': '← Back to Yoga Flow',
    'manual.welcome.title': 'Welcome to Your Training Manual',
    'manual.welcome.description': 'This comprehensive manual is your guide through the YogaFlow 200-Hour Teacher Training program. Each chapter builds upon the last, providing you with the knowledge, skills, and confidence to become an exceptional yoga instructor.',
    'manual.welcome.navigation': 'Navigate through the chapters below to access the complete curriculum. We recommend reading them in order, but feel free to revisit any section as needed during your training journey.',
    
    // Chapter 1
    'manual.chapter1.title': 'Chapter 1 — Welcome & Program Overview',
    'manual.chapter1.breadcrumb': '← Manual Index',
    'manual.chapter1.nav': 'Chapter 1',
    'manual.chapter1.welcome.title': 'Welcome to the Journey',
    'manual.chapter1.commitments.title': 'Our Mutual Commitments',
    'manual.chapter1.intention.title': 'Training Intention & Methodology',
    'manual.chapter1.setup.title': 'Setting Up for Success',
    'manual.chapter1.journals.title': 'The Power of Self-Reflection',
    'manual.chapter1.reading.title': 'Further Reading & Resources',
    'manual.chapter1.welcome.intro': 'Welcome to your YogaFlow Teacher Training—a transformative path of self-discovery, dedicated practice, and the art of guiding others. This manual is more than a textbook; it\'s your field guide and companion. We encourage you to engage with it fully: write in the margins, highlight what resonates, and let its pages spark new questions and insights.',
    'manual.chapter1.welcome.community': 'You are now an integral part of the YogaFlow teaching community, a network of passionate practitioners and teachers. We are thrilled to support your evolution as both a student and a future leader in the world of yoga.',
    'manual.chapter1.journey.card-title': 'The Journey of Transformation',
    'manual.chapter1.journey.info-title': 'A Journey, Not a Destination',
    'manual.chapter1.journey.info-text': 'This training is designed to be an immersive experience that transforms not just your understanding of yoga, but your entire approach to life. The skills and knowledge you gain will extend far beyond the yoga mat, influencing how you connect with yourself, interact with others, and navigate the complexities of daily life. Embrace the process with an open heart and a curious mind.',
    'manual.chapter1.journey.self-discovery': 'Self-Discovery',
    'manual.chapter1.journey.community-building': 'Community Building',
    'manual.chapter1.journey.leadership': 'Leadership',
    
    // Common chapter elements
    'manual.chapter.student': 'Student',
    'manual.chapter.practitioner': 'Practitioner', 
    'manual.chapter.teacher': 'Teacher',
    'manual.chapter.leader': 'Leader',
    'manual.chapter.yogaflow': 'YogaFlow',
    'manual.chapter.community': 'Community',
    
    // Homepage content sections
    'home.features.title': 'Everything You Need for Your Yoga Journey',
    'home.features.subtitle': 'Discover the power of AI-enhanced yoga practice with our comprehensive platform',
    'home.features.flow.title': 'Intelligent Flow Creation',
    'home.features.flow.description': 'Generate personalized yoga sequences powered by AI, tailored to your goals, experience level, and preferences.',
    'home.features.library.title': 'Comprehensive Pose Library', 
    'home.features.library.description': 'Access detailed instructions, modifications, and benefits for hundreds of yoga poses with expert guidance.',
    'home.features.meditation.title': 'Guided Meditation',
    'home.features.meditation.description': 'Enhance your practice with meditation techniques, breathing exercises, and mindfulness training.',
    'home.stats.poses': 'Yoga Poses',
    'home.stats.flows': 'Flow Combinations',
    'home.stats.sessions': 'Meditation Sessions',
    'home.cta.title': 'Ready to Transform Your Practice?',
    'home.cta.subtitle': 'Join thousands of yogis who have discovered the power of intelligent, personalized yoga flows.',
    'home.cta.button': 'Start Your Journey Today',
    
    // Common UI elements
    'common.search': 'Search',
    'common.search.placeholder': 'Search poses, flows, techniques...',
    'common.search.button': 'Search',
    'common.cancel': 'Cancel'
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
    'footer.carbon-neutral': 'Klimaneutrales Hosting',
    
    // Manual translations
    'manual.title': 'YogaFlow 200-Stunden Yogalehrer-Ausbildung Handbuch',
    'manual.back-to-home': '← Zurück zu Yoga Flow',
    'manual.welcome.title': 'Willkommen zu Ihrem Ausbildungshandbuch',
    'manual.welcome.description': 'Dieses umfassende Handbuch ist Ihr Leitfaden durch das YogaFlow 200-Stunden Yogalehrer-Ausbildungsprogramm. Jedes Kapitel baut auf dem vorherigen auf und vermittelt Ihnen das Wissen, die Fähigkeiten und das Vertrauen, um ein außergewöhnlicher Yogalehrer zu werden.',
    'manual.welcome.navigation': 'Navigieren Sie durch die unten stehenden Kapitel, um auf den vollständigen Lehrplan zuzugreifen. Wir empfehlen, sie in der Reihenfolge zu lesen, aber zögern Sie nicht, jeden Abschnitt während Ihrer Ausbildungsreise erneut zu besuchen.',
    
    // Chapter 1
    'manual.chapter1.title': 'Kapitel 1 — Willkommen & Programmübersicht',
    'manual.chapter1.breadcrumb': '← Handbuch Index',
    'manual.chapter1.nav': 'Kapitel 1',
    'manual.chapter1.welcome.title': 'Willkommen zur Reise',
    'manual.chapter1.commitments.title': 'Unsere gegenseitigen Verpflichtungen',
    'manual.chapter1.intention.title': 'Ausbildungsabsicht & Methodik',
    'manual.chapter1.setup.title': 'Erfolgreich aufstellen',
    'manual.chapter1.journals.title': 'Die Kraft der Selbstreflexion',
    'manual.chapter1.reading.title': 'Weiterführende Literatur & Ressourcen',
    'manual.chapter1.welcome.intro': 'Willkommen zu Ihrer YogaFlow Yogalehrer-Ausbildung—ein transformativer Weg der Selbstentdeckung, engagierten Praxis und der Kunst, andere zu führen. Dieses Handbuch ist mehr als ein Lehrbuch; es ist Ihr Feldführer und Begleiter. Wir ermutigen Sie, sich vollständig darauf einzulassen: schreiben Sie an die Ränder, markieren Sie, was mit Ihnen in Resonanz steht, und lassen Sie seine Seiten neue Fragen und Einsichten entfachen.',
    'manual.chapter1.welcome.community': 'Sie sind nun ein integraler Teil der YogaFlow Lehrgemeinschaft, ein Netzwerk leidenschaftlicher Praktizierender und Lehrer. Wir freuen uns darauf, Ihre Entwicklung sowohl als Student als auch als zukünftiger Anführer in der Welt des Yoga zu unterstützen.',
    'manual.chapter1.journey.card-title': 'Die Reise der Transformation',
    'manual.chapter1.journey.info-title': 'Eine Reise, kein Ziel',
    'manual.chapter1.journey.info-text': 'Diese Ausbildung ist darauf ausgelegt, eine intensive Erfahrung zu sein, die nicht nur Ihr Verständnis von Yoga transformiert, sondern Ihren gesamten Lebensansatz. Die Fähigkeiten und das Wissen, das Sie erlangen, werden weit über die Yogamatte hinausgehen und beeinflussen, wie Sie sich mit sich selbst verbinden, mit anderen interagieren und die Komplexitäten des täglichen Lebens navigieren. Umarmen Sie den Prozess mit einem offenen Herzen und einem neugierigen Geist.',
    'manual.chapter1.journey.self-discovery': 'Selbstentdeckung',
    'manual.chapter1.journey.community-building': 'Gemeinschaftsaufbau',
    'manual.chapter1.journey.leadership': 'Führung',
    
    // Common chapter elements
    'manual.chapter.student': 'Student',
    'manual.chapter.practitioner': 'Praktizierender',
    'manual.chapter.teacher': 'Lehrer',
    'manual.chapter.leader': 'Anführer',
    'manual.chapter.yogaflow': 'YogaFlow',
    'manual.chapter.community': 'Gemeinschaft',
    
    // Homepage content sections
    'home.features.title': 'Alles was Sie für Ihre Yoga-Reise brauchen',
    'home.features.subtitle': 'Entdecken Sie die Kraft der KI-gestützten Yoga-Praxis mit unserer umfassenden Plattform',
    'home.features.flow.title': 'Intelligente Flow-Erstellung',
    'home.features.flow.description': 'Generieren Sie personalisierte Yoga-Sequenzen mit KI-Unterstützung, zugeschnitten auf Ihre Ziele, Erfahrungsstufe und Präferenzen.',
    'home.features.library.title': 'Umfassende Asana-Bibliothek',
    'home.features.library.description': 'Greifen Sie auf detaillierte Anleitungen, Modifikationen und Vorteile für Hunderte von Yoga-Posen mit Expertenführung zu.',
    'home.features.meditation.title': 'Geführte Meditation',
    'home.features.meditation.description': 'Erweitern Sie Ihre Praxis mit Meditationstechniken, Atemübungen und Achtsamkeitstraining.',
    'home.stats.poses': 'Yoga-Posen',
    'home.stats.flows': 'Flow-Kombinationen',
    'home.stats.sessions': 'Meditations-Sitzungen',
    'home.cta.title': 'Bereit, Ihre Praxis zu transformieren?',
    'home.cta.subtitle': 'Schließen Sie sich Tausenden von Yogis an, die die Kraft intelligenter, personalisierter Yoga-Flows entdeckt haben.',
    'home.cta.button': 'Beginnen Sie Ihre Reise heute',
    
    // Common UI elements
    'common.search': 'Suchen',
    'common.search.placeholder': 'Posen, Flows, Techniken suchen...',
    'common.search.button': 'Suchen',
    'common.cancel': 'Abbrechen'
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
    'footer.carbon-neutral': 'Hosting neutru din punct de vedere al carbonului',
    
    // Manual translations
    'manual.title': 'Manual de formare pentru instructori Yoga Flow de 200 de ore',
    'manual.back-to-home': '← Înapoi la Yoga Flow',
    'manual.welcome.title': 'Bun venit la manualul dvs. de instruire',
    'manual.welcome.description': 'Acest manual cuprinzător este ghidul dvs. prin programul de formare pentru instructori YogaFlow de 200 de ore. Fiecare capitol se bazează pe cel anterior, oferindu-vă cunoștințele, abilitățile și încrederea pentru a deveni un instructor de yoga excepțional.',
    'manual.welcome.navigation': 'Navigați prin capitolele de mai jos pentru a accesa programa completă. Vă recomandăm să le citiți în ordine, dar nu ezitați să revizitați orice secțiune după cum este necesar în timpul călătoriei dvs. de formare.',
    
    // Chapter 1
    'manual.chapter1.title': 'Capitolul 1 — Bun venit și prezentare generală a programului',
    'manual.chapter1.breadcrumb': '← Index manual',
    'manual.chapter1.nav': 'Capitolul 1',
    'manual.chapter1.welcome.title': 'Bun venit în călătorie',
    'manual.chapter1.commitments.title': 'Angajamentele noastre reciproce',
    'manual.chapter1.intention.title': 'Intenția de instruire și metodologia',
    'manual.chapter1.setup.title': 'Pregătirea pentru succes',
    'manual.chapter1.journals.title': 'Puterea auto-reflecției',
    'manual.chapter1.reading.title': 'Lectură suplimentară și resurse',
    'manual.chapter1.welcome.intro': 'Bun venit la formarea dvs. de instructor YogaFlow—o cale transformatoare de autodescoperire, practică dedicată și arta de a ghida pe alții. Acest manual este mai mult decât un manual; este ghidul și companionul dvs. de teren. Vă încurajăm să vă angajați pe deplin cu acesta: scrieți în margini, evidențiați ce rezonează și lăsați paginile sale să declanșeze întrebări și perspective noi.',
    'manual.chapter1.welcome.community': 'Acum faceți parte integrantă din comunitatea de predare YogaFlow, o rețea de practicanți și profesori pasionați. Suntem încântați să vă sprijinim evoluția atât ca student, cât și ca viitor lider în lumea yoga.',
    'manual.chapter1.journey.card-title': 'Călătoria transformării',
    'manual.chapter1.journey.info-title': 'O călătorie, nu o destinație',
    'manual.chapter1.journey.info-text': 'Această formare este concepută să fie o experiență intensivă care transformă nu doar înțelegerea dvs. asupra yoga, ci întreaga dvs. abordare a vieții. Abilitățile și cunoștințele pe care le dobândiți se vor extinde mult dincolo de saltea, influențând modul în care vă conectați cu voi înșivă, interacționați cu alții și navigați complexitățile vieții de zi cu zi. Îmbrățișați procesul cu o inimă deschisă și o minte curioasă.',
    'manual.chapter1.journey.self-discovery': 'Autodescoperire',
    'manual.chapter1.journey.community-building': 'Construirea comunității',
    'manual.chapter1.journey.leadership': 'Conducere',
    
    // Common chapter elements
    'manual.chapter.student': 'Student',
    'manual.chapter.practitioner': 'Practicant',
    'manual.chapter.teacher': 'Profesor',
    'manual.chapter.leader': 'Lider',
    'manual.chapter.yogaflow': 'YogaFlow',
    'manual.chapter.community': 'Comunitate',
    
    // Homepage content sections
    'home.features.title': 'Tot ce aveți nevoie pentru călătoria voastră de yoga',
    'home.features.subtitle': 'Descoperiți puterea practicii de yoga îmbunătățite cu AI pe platforma noastră cuprinzătoare',
    'home.features.flow.title': 'Creare inteligentă de fluxuri',
    'home.features.flow.description': 'Generați secvențe de yoga personalizate alimentate de AI, adaptate obiectivelor, nivelului de experiență și preferințelor voastre.',
    'home.features.library.title': 'Bibliotecă cuprinzătoare de pozitii',
    'home.features.library.description': 'Accesați instrucțiuni detaliate, modificări și beneficii pentru sute de pozitii de yoga cu îndrumări de expert.',
    'home.features.meditation.title': 'Meditație ghidată',
    'home.features.meditation.description': 'Îmbunătățiți-vă practica cu tehnici de meditație, exerciții de respirație și antrenament de mindfulness.',
    'home.stats.poses': 'Pozitii de yoga',
    'home.stats.flows': 'Combinații de fluxuri',
    'home.stats.sessions': 'Sesiuni de meditație',
    'home.cta.title': 'Gata să vă transformați practica?',
    'home.cta.subtitle': 'Alăturați-vă miilor de practicanți de yoga care au descoperit puterea fluxurilor de yoga inteligente și personalizate.',
    'home.cta.button': 'Începeți călătoria azi',
    
    // Common UI elements
    'common.search': 'Căutare',
    'common.search.placeholder': 'Căutați pozitii, fluxuri, tehnici...',
    'common.search.button': 'Căutare',
    'common.cancel': 'Anulează'
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
    'footer.carbon-neutral': 'Углеродно-нейтральный хостинг',
    
    // Manual translations
    'manual.title': 'Руководство по подготовке инструкторов йоги YogaFlow на 200 часов',
    'manual.back-to-home': '← Назад к Yoga Flow',
    'manual.welcome.title': 'Добро пожаловать в ваше учебное руководство',
    'manual.welcome.description': 'Это всеобъемлющее руководство является вашим проводником через программу подготовки инструкторов YogaFlow на 200 часов. Каждая глава основывается на предыдущей, предоставляя вам знания, навыки и уверенность, чтобы стать исключительным инструктором йоги.',
    'manual.welcome.navigation': 'Перемещайтесь по главам ниже, чтобы получить доступ к полной учебной программе. Мы рекомендуем читать их по порядку, но не стесняйтесь пересматривать любой раздел по мере необходимости во время вашего обучения.',
    
    // Chapter 1
    'manual.chapter1.title': 'Глава 1 — Добро пожаловать и обзор программы',
    'manual.chapter1.breadcrumb': '← Указатель руководства',
    'manual.chapter1.nav': 'Глава 1',
    'manual.chapter1.welcome.title': 'Добро пожаловать в путешествие',
    'manual.chapter1.commitments.title': 'Наши взаимные обязательства',
    'manual.chapter1.intention.title': 'Цель обучения и методология',
    'manual.chapter1.setup.title': 'Настройка на успех',
    'manual.chapter1.journals.title': 'Сила самоанализа',
    'manual.chapter1.reading.title': 'Дополнительная литература и ресурсы',
    'manual.chapter1.welcome.intro': 'Добро пожаловать в вашу подготовку инструктора YogaFlow—трансформационный путь самопознания, преданной практики и искусства руководства другими. Это руководство больше, чем учебник; это ваш полевой справочник и спутник. Мы призываем вас полностью погрузиться в него: пишите на полях, выделяйте то, что резонирует, и позвольте его страницам вызвать новые вопросы и озарения.',
    'manual.chapter1.welcome.community': 'Теперь вы являетесь неотъемлемой частью сообщества преподавателей YogaFlow, сети страстных практикующих и учителей. Мы рады поддержать ваше развитие как студента и будущего лидера в мире йоги.',
    'manual.chapter1.journey.card-title': 'Путешествие трансформации',
    'manual.chapter1.journey.info-title': 'Путешествие, а не пункт назначения',
    'manual.chapter1.journey.info-text': 'Это обучение разработано как погружающий опыт, который трансформирует не только ваше понимание йоги, но и весь ваш подход к жизни. Навыки и знания, которые вы приобретете, выйдут далеко за пределы коврика для йоги, влияя на то, как вы соединяетесь с собой, взаимодействуете с другими и справляетесь со сложностями повседневной жизни. Примите процесс с открытым сердцем и любознательным умом.',
    'manual.chapter1.journey.self-discovery': 'Самопознание',
    'manual.chapter1.journey.community-building': 'Построение сообщества',
    'manual.chapter1.journey.leadership': 'Лидерство',
    
    // Common chapter elements
    'manual.chapter.student': 'Студент',
    'manual.chapter.practitioner': 'Практикующий',
    'manual.chapter.teacher': 'Учитель',
    'manual.chapter.leader': 'Лидер',
    'manual.chapter.yogaflow': 'YogaFlow',
    'manual.chapter.community': 'Сообщество',
    
    // Homepage content sections
    'home.features.title': 'Все что нужно для вашего йога-путешествия',
    'home.features.subtitle': 'Откройте силу практики йоги с поддержкой ИИ на нашей комплексной платформе',
    'home.features.flow.title': 'Интеллектуальное создание потоков',
    'home.features.flow.description': 'Создавайте персонализированные йога-последовательности с помощью ИИ, адаптированные под ваши цели, уровень опыта и предпочтения.',
    'home.features.library.title': 'Всеобъемлющая библиотека поз',
    'home.features.library.description': 'Получите доступ к подробным инструкциям, модификациям и преимуществам сотен поз йоги с экспертным руководством.',
    'home.features.meditation.title': 'Управляемая медитация',
    'home.features.meditation.description': 'Улучшите свою практику с помощью техник медитации, дыхательных упражнений и тренировки осознанности.',
    'home.stats.poses': 'Позы йоги',
    'home.stats.flows': 'Комбинации потоков',
    'home.stats.sessions': 'Сеансы медитации',
    'home.cta.title': 'Готовы преобразить свою практику?',
    'home.cta.subtitle': 'Присоединяйтесь к тысячам йогов, которые открыли силу интеллектуальных, персонализированных йога-потоков.',
    'home.cta.button': 'Начните путешествие сегодня',
    
    // Common UI elements
    'common.search': 'Поиск',
    'common.search.placeholder': 'Поиск поз, потоков, техник...',
    'common.search.button': 'Поиск',
    'common.cancel': 'Отмена'
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