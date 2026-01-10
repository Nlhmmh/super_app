import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import Compass from "@/components/sensor/Compass";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";

const SensorIndex = () => {
  const { t } = useTranslation();
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("home.sensor")} />
      <CustomScrollView>
        <ThemedView
          style={{
            flex: 1,
            paddingVertical: 18,
            paddingHorizontal: 12,
            gap: 24,
          }}
        >
          <Compass />
        </ThemedView>
      </CustomScrollView>
    </ThemedView>
  );
};

export default SensorIndex;
