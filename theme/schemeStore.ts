import * as SecureStore from "expo-secure-store";

// Simple pub/sub store to broadcast color scheme changes across the app and persist the choice.
const listeners = new Set<(scheme: ColorScheme) => void>();
const SECURE_COLOR_SCHEME_KEY = "colorScheme";

export const ThemeSchemes = {
  LIGHT: "light" as ColorScheme,
  DARK: "dark" as ColorScheme,
};

export type ColorScheme = (typeof ThemeSchemes)[keyof typeof ThemeSchemes];

export const schemeStore = {
  set: async (scheme: ColorScheme) => {
    try {
      await SecureStore.setItemAsync(SECURE_COLOR_SCHEME_KEY, scheme);
    } catch (error) {
      console.warn("Failed to store color scheme", error);
    }
    listeners.forEach((cb) => cb(scheme));
  },
  get: async (): Promise<ColorScheme | null> => {
    try {
      const stored = await SecureStore.getItemAsync(SECURE_COLOR_SCHEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (error) {
      console.warn("Failed to load color scheme", error);
    }
    return null;
  },
  subscribe: (cb: (scheme: ColorScheme) => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
