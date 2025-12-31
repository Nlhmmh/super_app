import { useTheme } from "@/theme/ThemeContext";
import { ActivityIndicator } from "react-native";
import { ThemedView } from "./ThemedView";

const Loading = () => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={theme.pink} />
    </ThemedView>
  );
};

export default Loading;
