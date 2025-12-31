import { useThemeColor } from "@/theme/useThemeColor";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useTheme: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  useTheme = false,
  ...otherProps
}: ThemedViewProps) {
  let themedColor;
  if (useTheme) {
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
    themedColor = backgroundColor;
  }
  return (
    <View
      style={[
        themedColor ? { backgroundColor: themedColor } : undefined,
        style,
      ]}
      {...otherProps}
    />
  );
}
