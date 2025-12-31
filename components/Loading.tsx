import { useTheme } from "@/theme/ThemeContext";
import { ActivityIndicator } from "react-native";
import { ThemedView } from "./ThemedView";

const Loading = ({ size = "large" }: { size?: "small" | "large" }) => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={size} color={theme.pink} />
    </ThemedView>
  );
};

export default Loading;
