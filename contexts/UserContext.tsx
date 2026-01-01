import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SECURE_USER_KEY = "secure_user";
const SECURE_COUNTRY_CODE_KEY = "secure_country_code";
const SECURE_LANGUAGE_CODE_KEY = "secure_language_code";

export type StoredUser = {
  id: number;
  username: string;
  email: string;
  token: string;
  phone: string;
  expiresAt?: string;
  [key: string]: unknown;
};

type UserContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  countryCode: string | null;
  languageCode: string | null;
  saveUser: (value: StoredUser) => Promise<void>;
  loadUser: () => Promise<StoredUser | null>;
  clearUser: () => Promise<void>;
  saveCountryCode?: (code: string) => Promise<void>;
  saveLanguageCode?: (code: string) => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [languageCode, setLanguageCode] = useState<string | null>(null);

  const saveUser = useCallback(async (value: StoredUser) => {
    setIsLoading(true);
    setError(null);
    try {
      await SecureStore.setItemAsync(SECURE_USER_KEY, JSON.stringify(value));
      setUser(value);
    } catch (err) {
      console.error("Failed to store user", err);
      setError("Failed to store user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await SecureStore.getItemAsync(SECURE_USER_KEY);
      if (!value) {
        setUser(null);
      } else {
        const parsed = JSON.parse(value) as StoredUser;
        setUser(parsed);
      }
      return value ? (JSON.parse(value) as StoredUser) : null;
    } catch (err) {
      console.error("Failed to load user", err);
      setError("Failed to load user");
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loadCountryCode = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync(SECURE_COUNTRY_CODE_KEY);
      setCountryCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load country code", err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadCountryCode();
  }, [loadCountryCode]);

  const loadLanguageCode = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync(SECURE_LANGUAGE_CODE_KEY);
      setLanguageCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load language code", err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadLanguageCode();
  }, [loadLanguageCode]);

  const saveCountryCode = useCallback(async (code: string) => {
    try {
      await SecureStore.setItemAsync(SECURE_COUNTRY_CODE_KEY, code);
      setCountryCode(code);
    } catch (err) {
      console.error("Failed to store country code", err);
    }
  }, []);

  const saveLanguageCode = useCallback(async (code: string) => {
    try {
      await SecureStore.setItemAsync(SECURE_LANGUAGE_CODE_KEY, code);
      setLanguageCode(code);
    } catch (err) {
      console.error("Failed to store language code", err);
    }
  }, []);

  const clearUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await SecureStore.deleteItemAsync(SECURE_USER_KEY);
      setUser(null);
    } catch (err) {
      console.error("Failed to clear user", err);
      setError("Failed to clear user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = (() => {
    if (!user?.token) return false;
    if (user.expiresAt) {
      const expires = new Date(user.expiresAt).getTime();
      if (Number.isFinite(expires) && expires <= Date.now()) {
        return false;
      }
    }
    return true;
  })();

  const value: UserContextValue = {
    user,
    isAuthenticated,
    isLoading,
    isReady,
    error,
    countryCode,
    languageCode,
    saveUser,
    loadUser,
    clearUser,
    saveCountryCode,
    saveLanguageCode
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
