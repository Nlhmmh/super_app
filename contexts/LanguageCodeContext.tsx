import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SECURE_LANGUAGE_CODE_KEY = "secure_language_code";

type LanguageCodeContextValue = {
  languageCode: string | null;
  isLoading: boolean;
  error: string | null;
  saveLanguageCode: (code: string) => Promise<void>;
  clearLanguageCode: () => Promise<void>;
};

const LanguageCodeContext = createContext<LanguageCodeContextValue | null>(null);

export function LanguageCodeProvider({ children }: { children: React.ReactNode }) {
  const [languageCode, setLanguageCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLanguageCode();
  }, [loadLanguageCode]);

  const loadLanguageCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_LANGUAGE_CODE_KEY);
      setLanguageCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load language code", err);
      setError("Failed to load language code");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveLanguageCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(SECURE_LANGUAGE_CODE_KEY, code);
      setLanguageCode(code);
    } catch (err) {
      console.error("Failed to store language code", err);
      setError("Failed to store language code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLanguageCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem(SECURE_LANGUAGE_CODE_KEY);
      setLanguageCode(null);
    } catch (err) {
      console.error("Failed to clear language code", err);
      setError("Failed to clear language code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: LanguageCodeContextValue = {
    languageCode,
    isLoading,
    error,
    saveLanguageCode,
    clearLanguageCode,
  };

  return (
    <LanguageCodeContext.Provider value={value}>
      {children}
    </LanguageCodeContext.Provider>
  );
}

export function useLanguageCode() {
  const context = useContext(LanguageCodeContext);
  if (!context) {
    throw new Error("useLanguageCode must be used within LanguageCodeProvider");
  }
  return context;
}
