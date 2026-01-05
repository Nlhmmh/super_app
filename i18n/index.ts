import { SECURE_LANGUAGE_KEY } from "@/contexts/LanguageContext";
import translationEn from "@/locales/en-US/translation.json";
import translationMy from "@/locales/my-MM/translation.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const Languages = {
  ENGLISH: "en-US",
  MYANMAR: "my-MM",
};

export type LanguageType = (typeof Languages)[keyof typeof Languages];

const supportedLanguages = Object.values(Languages);

export function isLanguageSupported(lang: string) {
  return supportedLanguages.includes(lang);
}

const resources = {
  [Languages.ENGLISH]: { translation: translationEn },
  [Languages.MYANMAR]: { translation: translationMy },
};

export const initI18n = async () => {
  const loc = Localization.getLocales?.()[0]?.languageTag || Languages.MYANMAR;

  let savedLanguage = loc;
  let storedLanguage = await AsyncStorage.getItem(SECURE_LANGUAGE_KEY);
  if (storedLanguage && !isLanguageSupported(storedLanguage)) {
    savedLanguage = storedLanguage;
  }

  await i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage,
    fallbackLng: Languages.MYANMAR,
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
