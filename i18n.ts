import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Or use SecureStore if preferred
import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";
import { I18nManager } from "react-native";
import * as Localization from "expo-localization";


// Load the stored language preference
const getStoredLanguage = async () => {
  const deviceLang = Localization?.locales?.[0]?.split("-")?.[0] || 'en'; // Detect the device language

  try {
    const storedLanguage = await AsyncStorage.getItem("language");
    const language = storedLanguage || deviceLang; // Default to Arabic if nothing is set
    return language;
  } catch (error) {
    console.error("Error fetching stored language: ", error);
    return deviceLang || "en";
  }
};


// Initialize i18n
getStoredLanguage().then((language) => {
  i18n
    .use(initReactI18next) // Connect i18next with React
    .init({
      resources: {
        en: { translation: translationEN },
        ar: { translation: translationAR },
      },
      lng: language, // Set language dynamically
      fallbackLng: 'ar', // Fallback to Arabic if language detection fails
      interpolation: { escapeValue: false }, // React already escapes values
    });
});

export default i18n;
