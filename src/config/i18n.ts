import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from '../locales/en-US.json';
import ptBR from '../locales/pt-BR.json';

const LANGUAGE_COOKIE = 'app_language';

// Get language from cookie
const getLanguageFromCookie = (): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'en-US';
  }
  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(cookie => cookie.trim().startsWith(`${LANGUAGE_COOKIE}=`));
  return langCookie ? langCookie.split('=')[1] : 'en-US';
};

// Save language to cookie
export const saveLanguageToCookie = (language: string): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  // Set cookie for 1 year
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${LANGUAGE_COOKIE}=${language};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: enUS },
      'pt-BR': { translation: ptBR },
    },
    lng: getLanguageFromCookie(),
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language when it changes
i18n.on('languageChanged', (lng) => {
  saveLanguageToCookie(lng);
});

export default i18n;
