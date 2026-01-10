import InfoCard from "@/components/info/InfoCard";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import {
  CellularGeneration,
  getCarrierNameAsync,
  getCellularGenerationAsync,
  getIsoCountryCodeAsync,
  getMobileCountryCodeAsync,
  getMobileNetworkCodeAsync,
} from "expo-cellular";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextType, ThemedText } from "../ThemedText";

const CellularInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  const [carrierName, setCarrierName] = useState<string | null>(null);
  const [cellularGeneration, setCellularGeneration] =
    useState<CellularGeneration | null>(null);
  const [isoCountryCode, setIsoCountryCode] = useState<string | null>(null);
  const [mobileCountryCode, setMobileCountryCode] = useState<string | null>(
    null
  );
  const [mobileNetworkCode, setMobileNetworkCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    (async () => {
      askCellularPermission({
        alertTitle: t("info.permission-needed"),
        alertMessage: t("info.cellular-permission"),
      });
      setCarrierName(await getCarrierNameAsync());
      setCellularGeneration(await getCellularGenerationAsync());
      setIsoCountryCode(await getIsoCountryCodeAsync());
      setMobileCountryCode(await getMobileCountryCodeAsync());
      setMobileNetworkCode(await getMobileNetworkCodeAsync());
    })();
  }, []);

  const formatCellularGeneration = (gen: CellularGeneration) => {
    switch (gen) {
      case CellularGeneration.CELLULAR_2G:
        return t("info.cellular-2g");
      case CellularGeneration.CELLULAR_3G:
        return t("info.cellular-3g");
      case CellularGeneration.CELLULAR_4G:
        return t("info.cellular-4g");
      case CellularGeneration.CELLULAR_5G:
        return t("info.cellular-5g");
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
          {t("info.cellular-info")}
        </ThemedText>
      </ThemedView>
      <InfoCard
        title={t("info.carrier-name")}
        info={carrierName || t("info.unknown")}
      />
      <InfoCard
        title={t("info.cellular-generation")}
        info={
          cellularGeneration
            ? formatCellularGeneration(cellularGeneration)
            : t("info.unknown")
        }
      />
      <InfoCard
        title={t("info.iso-country-code")}
        info={isoCountryCode || t("info.unknown")}
      />
      <InfoCard
        title={t("info.mobile-country-code")}
        info={mobileCountryCode || t("info.unknown")}
      />
      <InfoCard
        title={t("info.mobile-network-code")}
        info={mobileNetworkCode || t("info.unknown")}
      />
    </ThemedView>
  );
};

export default CellularInfo;
