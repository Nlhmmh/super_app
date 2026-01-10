import InfoCard from "@/components/info/InfoCard";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { NetworkStateType, useNetworkState } from "expo-network";
import { useTranslation } from "react-i18next";
import { TextType, ThemedText } from "../ThemedText";

const NetworkInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  const networkState = useNetworkState();

  const formatNetworkType = (type: NetworkStateType) => {
    switch (type) {
      case NetworkStateType.NONE:
        return t("info.none");
      case NetworkStateType.WIFI:
        return t("info.wifi");
      case NetworkStateType.CELLULAR:
        return t("info.cellular");
      case NetworkStateType.BLUETOOTH:
        return t("info.bluetooth");
      case NetworkStateType.ETHERNET:
        return t("info.ethernet");
      case NetworkStateType.VPN:
        return t("info.vpn");
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
          {t("info.network-info")}
        </ThemedText>
      </ThemedView>
      <InfoCard
        title={t("info.network-status")}
        info={
          networkState.isConnected
            ? t("info.connected")
            : t("info.disconnected")
        }
      />
      <InfoCard
        title={t("info.network-reachability")}
        info={
          networkState.isInternetReachable
            ? t("info.internet-reachable")
            : t("info.internet-unreachable")
        }
      />
      <InfoCard
        title={t("info.network-type")}
        info={formatNetworkType(networkState.type)}
      />
    </ThemedView>
  );
};

export default NetworkInfo;
