import Pad from "@/components/Pad";
import { UserProvider } from "@/contexts/UserContext";
import { DarkTheme, LightTheme } from "@/theme/theme";
import { ThemeProvider } from "@/theme/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;
  return (
    <SafeAreaProvider>
      <ThemeProvider currentTheme={theme}>
        <UserProvider>
          <SafeAreaView
            edges={["top", "bottom"]}
            style={{ flex: 1, backgroundColor: theme.background }}
          >
            <StatusBar style="light" />
            <Pad height={5} />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
