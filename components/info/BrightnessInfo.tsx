import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import Slider from "@react-native-community/slider";
import * as Brightness from "expo-brightness";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { TextType, ThemedText } from "../ThemedText";
import InfoCard from "./InfoCard";

const BrightnessInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  const [brightnessLevel, setBrightnessLevel] = useState(0);
  const [brightnessMode, setBrightnessMode] = useState(
    Brightness.BrightnessMode.UNKNOWN
  );

  useEffect(() => {
    (async () => {
      const permisson = await Brightness.getPermissionsAsync();
      if (!permisson.granted) {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t("info.permission-needed"),
            t("info.brightness-permission")
          );
        }
      }
      // Brightness.addBrightnessListener((data) => {
      //   setBrightnessLevel(data.brightness);
      // });
      setBrightnessLevel(await Brightness.getSystemBrightnessAsync());
      setBrightnessMode(await Brightness.getSystemBrightnessModeAsync());
    })();
  }, []);

  const formatBrightnessLevel = () => {
    return `${Math.round(brightnessLevel * 100)}%`;
  };

  const formatBrightnessMode = () => {
    switch (brightnessMode) {
      case Brightness.BrightnessMode.AUTOMATIC:
        return t("info.automatic");
      case Brightness.BrightnessMode.MANUAL:
        return t("info.manual");
      default:
        return t("info.unknown");
    }
  };

  useEffect(() => {
    (async () => {
      await Brightness.setBrightnessAsync(brightnessLevel);
    })();
  }, [brightnessLevel]);

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
          {t("info.brightness-info")}
        </ThemedText>
      </ThemedView>

      <InfoCard
        title={t("info.current-brightness-level")}
        info={formatBrightnessLevel()}
      />
      <InfoCard
        title={t("info.current-brightness-mode")}
        info={formatBrightnessMode()}
      />

      <Slider
        minimumValue={0}
        maximumValue={1}
        value={brightnessLevel}
        onValueChange={setBrightnessLevel}
        step={0.1}
        style={{ height: 24 }}
        minimumTrackTintColor={theme.onSecondaryContainer}
        maximumTrackTintColor={theme.onSecondaryContainer}
        thumbTintColor={theme.onSecondaryContainer}
      />
    </ThemedView>
  );
};

export default BrightnessInfo;
