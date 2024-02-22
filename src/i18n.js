// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Make sure these imports match the actual file paths in your project
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
const getUserLanguage = () => window.navigator.userLanguage || window.navigator.language;
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    lng: `${getUserLanguage()}`, // Set your default language here
    fallbackLng: 'en', // Set fallback language
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
