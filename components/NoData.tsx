import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import Pad from "./Pad";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const NoData = ({ text }: { text?: string }) => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
      }}
    >
      <Ionicons name="alert-circle-outline" size={24} color={theme.textTint} />
      <Pad />
      <ThemedText type={TextType.DEFAULT} style={{ color: theme.textTint }}>
        {text || "No Data Found"}
      </ThemedText>
    </ThemedView>
  );
};

export default NoData;
