import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import InfoCard from "@/components/info/InfoCard";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("settings.about")} />
      <ThemedView style={{ flex: 1, padding: 12 }}>
        <ThemedView
          style={{
            borderWidth: 1,
            borderColor: theme.outline,
            borderRadius: 12,
            padding: 12,
            gap: 4,
            backgroundColor: theme.background,
            ...commonStyles.lightShadow,
          }}
        >
          <InfoCard title={t("about.app-version")} info="1.0.0" />
          <InfoCard title={t("about.developed-by")} info="Nlhmmh" />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default AboutPage;
