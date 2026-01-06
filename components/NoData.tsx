import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Pad from "./Pad";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const NoData = ({ text }: { text?: string }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
      <ThemedText style={{ color: theme.textTint }}>
        {text || t("general.no-data-found")}
      </ThemedText>
    </ThemedView>
  );
};

export default NoData;
