import Pad from "@/components/Pad";
import { UserProvider } from "@/contexts/UserContext";
import { schemeStore } from "@/theme/schemeStore";
import { DarkTheme, LightTheme } from "@/theme/theme";
import { ThemeProvider } from "@/theme/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const [currentScheme, setCurrentScheme] = useState(colorScheme);
  const theme = currentScheme === "dark" ? DarkTheme : LightTheme;

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
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  // Listen for in-app theme toggle events
  useEffect(() => {
    const unsubscribe = schemeStore.subscribe((scheme) => {
      setCurrentScheme(scheme);
      Appearance.setColorScheme(scheme);
    });
    return unsubscribe;
  }, []);

  // Keep in sync with useColorScheme changes
  useEffect(() => {
    setCurrentScheme(colorScheme);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider currentTheme={theme}>
        <UserProvider>
          <SafeAreaView
            edges={["top"]}
            style={{ flex: 1, backgroundColor: theme.background }}
          >
            <StatusBar />
            <Pad height={5} />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
