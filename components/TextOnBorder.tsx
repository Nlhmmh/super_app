import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { useTranslation } from "react-i18next";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const TextOnBorder = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <ThemedView
      style={{
        position: "absolute",
        top: -16,
        left: 8,
        paddingHorizontal: 4,
      }}
    >
      <ThemedText
        bold
        type={TextType.L}
        style={{ backgroundColor: theme.background }}
      >
        {t(text)}
      </ThemedText>
    </ThemedView>
  );
};

export default TextOnBorder;
