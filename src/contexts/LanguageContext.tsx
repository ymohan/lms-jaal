import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'ta';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    courses: 'Courses',
    students: 'Students',
    teachers: 'Teachers',
    analytics: 'Analytics',
    settings: 'Settings',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    email: 'Email',
    password: 'Password',
    selectRole: 'Select Role',
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    
    // Dashboard
    totalCourses: 'Total Courses',
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    completionRate: 'Completion Rate',
    
    // Courses
    createCourse: 'Create Course',
    courseTitle: 'Course Title',
    courseDescription: 'Course Description',
    selectLevel: 'Select Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    
    // Learning
    startLearning: 'Start Learning',
    continueReading: 'Continue Reading',
    practiceNow: 'Practice Now',
    takeQuiz: 'Take Quiz',
    
    // Skills
    reading: 'Reading',
    writing: 'Writing',
    speaking: 'Speaking',
    listening: 'Listening',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    courses: 'पाठ्यक्रम',
    students: 'छात्र',
    teachers: 'शिक्षक',
    analytics: 'विश्लेषण',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    
    // Auth
    login: 'लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    selectRole: 'भूमिका चुनें',
    admin: 'प्रशासक',
    teacher: 'शिक्षक',
    student: 'छात्र',
    
    // Common
    welcome: 'स्वागत',
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    create: 'बनाएं',
    
    // Dashboard
    totalCourses: 'कुल पाठ्यक्रम',
    totalStudents: 'कुल छात्र',
    totalTeachers: 'कुल शिक्षक',
    completionRate: 'पूर्णता दर',
    
    // Courses
    createCourse: 'पाठ्यक्रम बनाएं',
    courseTitle: 'पाठ्यक्रम शीर्षक',
    courseDescription: 'पाठ्यक्रम विवरण',
    selectLevel: 'स्तर चुनें',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    
    // Learning
    startLearning: 'सीखना शुरू करें',
    continueReading: 'पढ़ना जारी रखें',
    practiceNow: 'अभी अभ्यास करें',
    takeQuiz: 'प्रश्नोत्तरी लें',
    
    // Skills
    reading: 'पढ़ना',
    writing: 'लिखना',
    speaking: 'बोलना',
    listening: 'सुनना',
  },
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு',
    courses: 'பாடத்திட்டங்கள்',
    students: 'மாணவர்கள்',
    teachers: 'ஆசிரியர்கள்',
    analytics: 'பகுப்பாய்வு',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    
    // Auth
    login: 'உள்நுழைய',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    selectRole: 'பங்கு தேர்வு செய்க',
    admin: 'நிர்வாகி',
    teacher: 'ஆசிரியர்',
    student: 'மாணவர்',
    
    // Common
    welcome: 'வரவேற்கிறோம்',
    loading: 'ஏற்றுகிறது...',
    save: 'சேமி',
    cancel: 'ரத்து',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    create: 'உருவாக்கு',
    
    // Dashboard
    totalCourses: 'மொத்த பாடத்திட்டங்கள்',
    totalStudents: 'மொத்த மாணவர்கள்',
    totalTeachers: 'மொத்த ஆசிரியர்கள்',
    completionRate: 'நிறைவு விகிதம்',
    
    // Courses
    createCourse: 'பாடத்திட்டம் உருவாக்கு',
    courseTitle: 'பாடத்திட்ட தலைப்பு',
    courseDescription: 'பாடத்திட்ட விளக்கம்',
    selectLevel: 'நிலை தேர்வு செய்க',
    beginner: 'தொடக்கநிலை',
    intermediate: 'நடு நிலை',
    advanced: 'மேம்பட்ட',
    
    // Learning
    startLearning: 'கற்றலைத் தொடங்கு',
    continueReading: 'படிப்பைத் தொடர்',
    practiceNow: 'இப்போது பயிற்சி',
    takeQuiz: 'வினாடி வினா எடு',
    
    // Skills
    reading: 'படித்தல்',
    writing: 'எழுதுதல்',
    speaking: 'பேசுதல்',
    listening: 'கேட்டல்',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['en', 'hi', 'ta'].includes(stored)) {
      setCurrentLanguage(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}