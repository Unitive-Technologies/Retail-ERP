import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as lanResources from "./resources";

console.log("lanResources", lanResources);
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    compatibilityJSON: "v4",
    resources: {
      ...Object.entries(lanResources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            translation: value,
          },
        }),
        {}
      ),
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
