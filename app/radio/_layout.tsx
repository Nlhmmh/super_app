import { useTheme } from "@/theme/ThemeContext";
import { Stack } from "expo-router";

export default function RadioLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[stationId]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="favourites"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
