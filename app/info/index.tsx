import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import BatteryInfo from "@/components/info/BatteryInfo";
import BrightnessInfo from "@/components/info/BrightnessInfo";
import CellularInfo from "@/components/info/CellularInfo";
import DeviceInfo from "@/components/info/DeviceInfo";
import NetworkInfo from "@/components/info/NetworkInfo";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";

const InfoIndex = () => {
  const { t } = useTranslation();
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("home.info")} />
      <CustomScrollView>
        <ThemedView style={{ flex: 1, padding: 12, gap: 24 }}>
          <DeviceInfo />
          <BatteryInfo />
          <BrightnessInfo />
          <NetworkInfo />
          <CellularInfo />
        </ThemedView>
      </CustomScrollView>
    </ThemedView>
  );
};

export default InfoIndex;
