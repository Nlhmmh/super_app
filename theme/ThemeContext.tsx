import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { DarkTheme, LightTheme } from "./theme";
import { Theme } from "./types";

export const SECURE_SCHEME_KEY = "secure_scheme";

export const ThemeSchemes = {
  LIGHT: "light",
  DARK: "dark",
};

type ThemeContextValue = {
  theme: Theme;
  scheme: ColorSchemeName;
  saveScheme: (scheme: ColorSchemeName) => Promise<void>;
  clearScheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  currentTheme: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(LightTheme);
  const [scheme, setScheme] = useState<ColorSchemeName>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScheme = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_SCHEME_KEY);
      setScheme(value);
      return value;
    } catch (err) {
      console.error("Failed to load scheme", err);
      setError("Failed to load scheme");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveScheme = useCallback(async (scheme: ColorSchemeName) => {
    if (!scheme) return;
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(SECURE_SCHEME_KEY, scheme);
      setScheme(scheme);
    } catch (err) {
      console.error("Failed to store scheme", err);
      setError("Failed to store scheme");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearScheme = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem(SECURE_SCHEME_KEY);
      setScheme(null);
    } catch (err) {
      console.error("Failed to clear scheme", err);
      setError("Failed to clear scheme");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setThemeByScheme = useCallback((scheme: ColorSchemeName) => {
    if (scheme === ThemeSchemes.DARK) {
      setTheme(DarkTheme);
      return;
    }
    setTheme(LightTheme);
  }, []);

  useEffect(() => {
    loadScheme();
  }, [loadScheme]);

  useEffect(() => {
    if (scheme === null) {
      const colorScheme = Appearance.getColorScheme();
      setThemeByScheme(colorScheme);
      return;
    }
    setThemeByScheme(scheme);
  }, [scheme]);

  const value: ThemeContextValue = {
    theme,
    scheme,
    saveScheme,
    clearScheme,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
