import { useTheme } from "@/theme/ThemeContext";
import { StyleSheet } from "react-native";

export const useCommonStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    shadow: {
      elevation: 10,
      shadowColor: theme.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    lightShadow: {
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    boxShadow: {
      boxShadow: `1px 1px 4px rgba(0, 0, 0, 0.5)`,
    }
  });
};
