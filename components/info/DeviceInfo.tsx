import InfoCard from "@/components/info/InfoCard";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { formatDisplayMemory } from "@/utils/utils";
import * as Device from "expo-device";
import { useTranslation } from "react-i18next";
import { TextType, ThemedText } from "../ThemedText";

const DeviceInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <ThemedView
      style={{
        borderWidth: 1,
        borderColor: theme.outline,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 16,
        gap: 4,
        backgroundColor: theme.background,
        ...commonStyles.lightShadow,
      }}
    >
      <ThemedView
        style={{
          position: "absolute",
          top: -16,
          left: 8,
          paddingHorizontal: 4,
          backgroundColor: theme.background,
        }}
      >
        <ThemedText bold type={TextType.L}>
          {t("info.device-info")}
        </ThemedText>
      </ThemedView>
      <InfoCard title={t("info.brand")} info={Device.brand} />
      <InfoCard title={t("info.manufacturer")} info={Device.manufacturer} />
      <InfoCard title={t("info.model-name")} info={Device.modelName} />
      <InfoCard
        title={t("info.device-type")}
        info={
          Device.deviceType === Device.DeviceType.PHONE
            ? t("info.phone")
            : Device.deviceType === Device.DeviceType.TABLET
            ? t("info.tablet")
            : t("info.unknown")
        }
      />
      <InfoCard
        title={t("info.device-year")}
        info={"" + Device.deviceYearClass}
      />
      <InfoCard title={t("info.os-name")} info={Device.osName} />
      <InfoCard title={t("info.os-version")} info={Device.osVersion} />
      <InfoCard
        title={t("info.platform-api-level")}
        info={Device.platformApiLevel}
      />
      <InfoCard
        title={t("info.total-memory")}
        info={formatDisplayMemory(Device.totalMemory)}
      />
    </ThemedView>
  );
};

export default DeviceInfo;
