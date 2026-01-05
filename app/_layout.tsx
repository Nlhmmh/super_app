import Pad from "@/components/Pad";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { CountryCodeProvider } from "@/contexts/CountryCodeContext";
import { FavouriteStationsProvider } from "@/contexts/FavouriteStationsContext";
import { LanguageCodeProvider } from "@/contexts/LanguageCodeContext";
import { UserProvider } from "@/contexts/UserContext";
import { initI18n } from "@/i18n";
import { schemeStore } from "@/theme/schemeStore";
import { DarkTheme, LightTheme } from "@/theme/theme";
import { ThemeProvider } from "@/theme/ThemeContext";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const [currentScheme, setCurrentScheme] = useState(colorScheme);
  const theme = currentScheme === "dark" ? DarkTheme : LightTheme;

  useEffect(() => {
    initI18n();
  }, []);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "duckOthers",
      interruptionModeAndroid: "duckOthers",
    });
  }, []);

  // Load persisted scheme on mount
  useEffect(() => {
    schemeStore.get().then((stored) => {
      if (!stored) return;
      setCurrentScheme(stored);
      Appearance.setColorScheme(stored);
    });
  }, []);

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      async ({ colorScheme }) => {
        const storedScheme = await schemeStore.get();
        if (!storedScheme) setCurrentScheme(colorScheme);
      }
    );
    return () => subscription.remove();
  }, []);

  // Listen for in-app theme toggle events
  useEffect(() => {
    const unsubscribe = schemeStore.subscribe((scheme) => {
      setCurrentScheme(scheme);
      Appearance.setColorScheme(scheme);
    });
    unsubscribe;
  }, []);

  // Keep in sync with useColorScheme changes
  useEffect(() => {
    setCurrentScheme(colorScheme);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider currentTheme={theme}>
        <UserProvider>
          <CountryCodeProvider>
            <LanguageCodeProvider>
              <FavouriteStationsProvider>
                <AudioPlayerProvider>
                  <SafeAreaView
                    edges={["top", "bottom"]}
                    style={{ flex: 1, backgroundColor: theme.background }}
                  >
                    <StatusBar />
                    <Pad height={5} />
                    <Stack screenOptions={{ headerShown: false }} />
                  </SafeAreaView>
                </AudioPlayerProvider>
              </FavouriteStationsProvider>
            </LanguageCodeProvider>
          </CountryCodeProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
