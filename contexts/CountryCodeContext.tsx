import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SECURE_COUNTRY_CODE_KEY = "secure_country_code";

type CountryCodeContextValue = {
  countryCode: string | null;
  isLoading: boolean;
  error: string | null;
  saveCountryCode: (code: string) => Promise<void>;
  clearCountryCode: () => Promise<void>;
};

const CountryCodeContext = createContext<CountryCodeContextValue | null>(null);

export function CountryCodeProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCountryCode();
  }, [loadCountryCode]);

  const loadCountryCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_COUNTRY_CODE_KEY);
      setCountryCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load country code", err);
      setError("Failed to load country code");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCountryCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(SECURE_COUNTRY_CODE_KEY, code);
      setCountryCode(code);
    } catch (err) {
      console.error("Failed to store country code", err);
      setError("Failed to store country code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCountryCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem(SECURE_COUNTRY_CODE_KEY);
      setCountryCode(null);
    } catch (err) {
      console.error("Failed to clear country code", err);
      setError("Failed to clear country code");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CountryCodeContextValue = {
    countryCode,
    isLoading,
    error,
    saveCountryCode,
    clearCountryCode,
  };

  return (
    <CountryCodeContext.Provider value={value}>
      {children}
    </CountryCodeContext.Provider>
  );
}

export function useCountryCode() {
  const context = useContext(CountryCodeContext);
  if (!context) {
    throw new Error("useCountryCode must be used within CountryCodeProvider");
  }
  return context;
}
