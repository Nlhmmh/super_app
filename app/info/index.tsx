import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import InfoCard from "@/components/InfoCard";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import * as Device from "expo-device";
import { useTranslation } from "react-i18next";

const InfoIndex = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("home.info")} />
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
          <InfoCard title="App Version" info="1.0.0" />
          <InfoCard title="Developer" info="Nlhmmh" />
          <InfoCard title="Brand" info={Device.brand} />
          <InfoCard title="Device Name" info={Device.deviceName} />
          <InfoCard
            title="Device Type"
            info={
              Device.deviceType === Device.DeviceType.PHONE ? "Phone" : "Tablet"
            }
          />
          <InfoCard
            title="Device Year"
            info={"" + Device.deviceYearClass}
          />
          <InfoCard title="Manufacturer" info={Device.manufacturer} />
          <InfoCard title="Model Name" info={Device.modelName} />
          <InfoCard title="OS Name" info={Device.osName} />
          <InfoCard title="OS Version" info={Device.osVersion} />
          <InfoCard title="Platform API Level" info={Device.platformApiLevel} />
          <InfoCard title="Total Memory" info={Device.totalMemory} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default InfoIndex;
