import Pad from "@/components/Pad";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { CountryCodeProvider } from "@/contexts/CountryCodeContext";
import { FavouriteStationsProvider } from "@/contexts/FavouriteStationsContext";
import { LanguageCodeProvider } from "@/contexts/LanguageCodeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { initI18n } from "@/i18n";
import { DarkTheme, LightTheme } from "@/theme/theme";
import { ThemeProvider } from "@/theme/ThemeContext";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

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

  return (
    <SafeAreaProvider>
      <ThemeProvider currentTheme={theme}>
        <UserProvider>
          <LanguageProvider>
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
          </LanguageProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
