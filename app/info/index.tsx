import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import BatteryInfo from "@/components/info/BatteryInfo";
import BrightnessInfo from "@/components/info/BrightnessInfo";
import DeviceInfo from "@/components/info/DeviceInfo";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";

const InfoIndex = () => {
  const { t } = useTranslation();
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("home.info")} />
      <ThemedView style={{ flex: 1, padding: 12, gap: 24 }}>
        <DeviceInfo />
        <BatteryInfo />
        <BrightnessInfo />
      </ThemedView>
    </ThemedView>
  );
};

export default InfoIndex;
