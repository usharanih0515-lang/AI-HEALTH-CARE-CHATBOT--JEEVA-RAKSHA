/**
 * =============================================================================
 * Jeeva Raksha — i18n Internationalisation Setup (utils/i18n.js)
 * =============================================================================
 * Description : Configures i18next with react-i18next for multilingual support.
 *               Language files are located in assets/locales/<lang>/translation.json.
 *               The app detects and uses the device's system language by default.
 *
 * Usage       :
 *   // In a component:
 *   import { useTranslation } from 'react-i18next';
 *   const { t, i18n } = useTranslation();
 *   t('common.welcome') // → 'Welcome' (or translated equivalent)
 *
 *   // Change language programmatically:
 *   i18n.changeLanguage('hi'); // Switch to Hindi
 *
 * Supported Languages (initial):
 *   en — English
 *   hi — Hindi
 *   ta — Tamil
 *   te — Telugu
 *   bn — Bengali
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

// ─── Translation Resources ────────────────────────────────────────────────────
// Import translation JSON files directly (bundled with the app)
import en from '../assets/locales/en/translation.json';
import hi from '../assets/locales/hi/translation.json';
import ta from '../assets/locales/ta/translation.json';

// ─────────────────────────────────────────────────────────────────────────────
// Detect the device's preferred language
// getLocales() returns an array sorted by user preference.
// ─────────────────────────────────────────────────────────────────────────────
const SUPPORTED_LANGUAGES = ['en', 'hi', 'ta', 'te', 'bn'];

const detectDeviceLanguage = () => {
  try {
    const locales        = getLocales();
    const preferredLang  = locales[0]?.languageCode || 'en';
    return SUPPORTED_LANGUAGES.includes(preferredLang) ? preferredLang : 'en';
  } catch {
    return 'en';
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// i18next Initialisation
// ─────────────────────────────────────────────────────────────────────────────
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
    },

    lng            : detectDeviceLanguage(),
    fallbackLng    : 'en',          // Use English if translation is missing
    interpolation  : {
      escapeValue: false,           // React handles XSS escaping
    },
    compatibilityJSON: 'v3',        // Required for React Native / Android
  });

export default i18next;
