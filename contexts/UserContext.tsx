import { labelValuePair, Language } from "@/utils/models";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SECURE_USER_KEY = "secure_user";

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
  saveUser: (value: StoredUser) => Promise<void>;
  loadUser: () => Promise<StoredUser | null>;
  clearUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
    saveUser,
    loadUser,
    clearUser,
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
