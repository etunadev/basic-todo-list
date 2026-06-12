import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import tr from './tr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      tr: {
        translation: tr,
      },
    },
    // Telefonun sistem dilini otomatik olarak alır (örn: 'tr' veya 'en')
    lng: Localization.getLocales()[0].languageCode ?? 'en', 
    fallbackLng: 'en', // Eğer sistem dili bulunamazsa İngilizceye döner
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;