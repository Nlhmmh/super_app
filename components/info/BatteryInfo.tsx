import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { BatteryState, useBatteryLevel, useBatteryState } from "expo-battery";
import { useTranslation } from "react-i18next";
import { TextType, ThemedText } from "../ThemedText";
import InfoCard from "./InfoCard";

const BatteryInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  const batteryLevel = useBatteryLevel();
  const batteryState = useBatteryState();

  const formattedBatteryLevel = batteryLevel
    ? `${Math.round(batteryLevel * 100)}%`
    : t("info.unknown");

  const formatBatteryState = (state: number) => {
    switch (state) {
      case BatteryState.UNPLUGGED:
        return t("info.unplugged");
      case BatteryState.CHARGING:
        return t("info.charging");
      case BatteryState.FULL:
        return t("info.full");
      default:
        return t("info.unknown");
    }
  };

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
          {t("info.battery-info")}
        </ThemedText>
      </ThemedView>

      <InfoCard
        title={t("info.current-battery-level")}
        info={formattedBatteryLevel}
      />
      <InfoCard
        title={t("info.current-battery-state")}
        info={formatBatteryState(batteryState)}
      />
    </ThemedView>
  );
};

export default BatteryInfo;
