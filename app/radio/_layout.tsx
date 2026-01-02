import { useTheme } from "@/theme/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="[stationId]"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
