import { LanguageType } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const SECURE_LANGUAGE_KEY = "secure_language";

type LanguageContextValue = {
  languageCode: LanguageType | null;
  isLoading: boolean;
  error: LanguageType | null;
  saveLanguageCode: (code: LanguageType) => Promise<void>;
  clearLanguageCode: () => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<LanguageType | null>(null);

  const loadLanguage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_LANGUAGE_KEY);
      setLanguage(value);
      return value;
    } catch (err) {
      console.error("Failed to load language code", err);
      setError("Failed to load language code");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveLanguage = useCallback(async (code: LanguageType) => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(SECURE_LANGUAGE_KEY, code);
      setLanguage(code);
    } catch (err) {
      console.error("Failed to store language code", err);
      setError("Failed to store language code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLanguage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem(SECURE_LANGUAGE_KEY);
      setLanguage(null);
    } catch (err) {
      console.error("Failed to clear language code", err);
      setError("Failed to clear language code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: LanguageContextValue = {
    languageCode: language,
    isLoading,
    error,
    saveLanguageCode: saveLanguage,
    clearLanguageCode: clearLanguage,
  };

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
