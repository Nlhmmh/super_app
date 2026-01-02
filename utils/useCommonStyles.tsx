import { useTheme } from "@/theme/ThemeContext";
import { StyleSheet } from "react-native";

export const useCommonStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    shadow: {
      elevation: 10,
      shadowColor: theme.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    lightShadow: {
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
  });
};
