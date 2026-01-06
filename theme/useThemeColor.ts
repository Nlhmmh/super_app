import { DarkTheme, LightTheme } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeContext";
import { useColorScheme } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof LightTheme & keyof typeof DarkTheme
) {
  const colorScheme = useColorScheme() ?? "light";
  const colorFromProps = props[colorScheme];
  const { theme } = useTheme();
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorName];
  }
}
