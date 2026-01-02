import { station } from "@/utils/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const SECURE_FAVOURITE_STATIONS_KEY = "secure_favourite_stations";

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
  favouriteRadioStations: string[] | null;
  saveUser: (value: StoredUser) => Promise<void>;
  clearUser: () => Promise<void>;
  saveCountryCode?: (code: string) => Promise<void>;
  saveLanguageCode?: (code: string) => Promise<void>;
  saveFavouriteRadioStations: (uuids: string[]) => Promise<void>;
  toggleFavouriteRadioStation: (station: station) => Promise<void>;
  isFavouriteRadioStation: (station: station) => boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [languageCode, setLanguageCode] = useState<string | null>(null);
  const [favouriteRadioStations, setFavouriteRadioStations] = useState<
    string[] | null
  >(null);

  // User Data

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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

  const saveUser = useCallback(async (value: StoredUser) => {
    setIsLoading(true);
    setError(null);
    try {
      // Only store essential user fields to minimize storage size
      const userToStore: StoredUser = {
        id: value.id,
        username: value.username,
        email: value.email,
        token: value.token,
        phone: value.phone,
        expiresAt: value.expiresAt,
      };
      await SecureStore.setItemAsync(
        SECURE_USER_KEY,
        JSON.stringify(userToStore)
      );
      setUser(value);
    } catch (err) {
      console.error("Failed to store user", err);
      setError("Failed to store user");
    } finally {
      setIsLoading(false);
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

  // Country Code

  useEffect(() => {
    loadCountryCode();
  }, [loadCountryCode]);

  const loadCountryCode = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(SECURE_COUNTRY_CODE_KEY);
      setCountryCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load country code", err);
      return null;
    }
  }, []);

  const saveCountryCode = useCallback(async (code: string) => {
    try {
      await AsyncStorage.setItem(SECURE_COUNTRY_CODE_KEY, code);
      setCountryCode(code);
    } catch (err) {
      console.error("Failed to store country code", err);
    }
  }, []);

  // Language Code

  useEffect(() => {
    loadLanguageCode();
  }, [loadLanguageCode]);

  const loadLanguageCode = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(SECURE_LANGUAGE_CODE_KEY);
      setLanguageCode(value);
      return value;
    } catch (err) {
      console.error("Failed to load language code", err);
      return null;
    }
  }, []);

  const saveLanguageCode = useCallback(async (code: string) => {
    try {
      await AsyncStorage.setItem(SECURE_LANGUAGE_CODE_KEY, code);
      setLanguageCode(code);
    } catch (err) {
      console.error("Failed to store language code", err);
    }
  }, []);

  // Favourite Radio Stations

  useEffect(() => {
    loadFavouriteRadioStations();
  }, [loadFavouriteRadioStations]);

  const loadFavouriteRadioStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_FAVOURITE_STATIONS_KEY);
      if (!value) {
        setFavouriteRadioStations(null);
      } else {
        const parsed = JSON.parse(value) as string[];
        setFavouriteRadioStations(parsed);
      }
      return value ? (JSON.parse(value) as string[]) : null;
    } catch (err) {
      console.error("Failed to load favourite radio stations", err);
      setError("Failed to load favourite radio stations");
      setFavouriteRadioStations(null);
      return null;
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  const saveFavouriteRadioStations = useCallback(async (uuids: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(
        SECURE_FAVOURITE_STATIONS_KEY,
        JSON.stringify(uuids)
      );
      setFavouriteRadioStations(uuids);
    } catch (err) {
      console.error("Failed to store favourite radio stations", err);
      setError("Failed to store favourite radio stations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavouriteRadioStation = useCallback(
    async (station: station) => {
      const currentUuids = favouriteRadioStations || [];
      const isAlreadyFavorite = currentUuids.includes(station.stationuuid);

      let updatedUuids: string[];
      if (isAlreadyFavorite) {
        // Remove station UUID if already in favorites
        updatedUuids = currentUuids.filter(
          (uuid) => uuid !== station.stationuuid
        );
      } else {
        // Add station UUID to favorites
        updatedUuids = [...currentUuids, station.stationuuid];
      }

      await saveFavouriteRadioStations(updatedUuids);
    },
    [favouriteRadioStations, saveFavouriteRadioStations]
  );

  const isFavouriteRadioStation = useCallback(
    (station: station) => {
      if (!favouriteRadioStations) return false;
      return favouriteRadioStations.includes(station.stationuuid);
    },
    [favouriteRadioStations]
  );

  const value: UserContextValue = {
    user,
    isAuthenticated,
    isLoading,
    isReady,
    error,
    countryCode,
    languageCode,
    favouriteRadioStations,
    clearUser,
    saveUser,
    saveCountryCode,
    saveLanguageCode,
    saveFavouriteRadioStations,
    isFavouriteRadioStation,
    toggleFavouriteRadioStation,
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
