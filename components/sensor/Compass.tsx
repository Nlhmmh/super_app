import { useTheme } from "@/theme/ThemeContext";
import { askMagnetometerPermission } from "@/utils/permission";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, Easing } from "react-native";
import Pad from "../Pad";
import TextOnBorder from "../TextOnBorder";
import { TextType, ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const { width } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(width * 0.8, 350);
const INNER_CIRCLE_SIZE = COMPASS_SIZE - 40;
const NEEDLE_SIZE = COMPASS_SIZE - 60;

export default function Compass() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  const [subscription, setSubscription] = useState(null);
  const [degree, setDegree] = useState(0);
  const [direction, setDirection] = useState("N");
  const needleAnim = useRef(new Animated.Value(0)).current;
  const lastNeedleAngle = useRef(0);

  const _subscribe = () => {
    Magnetometer.setUpdateInterval(100);
    setSubscription(
      Magnetometer.addListener((result) => {
        const { x, y, z } = result;
        let angle = 0;
        if (x && y) {
          // Negate X to reverse East/West
          angle = Math.atan2(-x, y) * (180 / Math.PI);
          angle = (angle + 360) % 360;
        }
        setDegree(Math.round(angle));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const calculateDirection = () => {
    return degree >= 337.5 || degree < 22.5
      ? "N"
      : degree >= 22.5 && degree < 67.5
      ? "NE"
      : degree >= 67.5 && degree < 112.5
      ? "E"
      : degree >= 112.5 && degree < 157.5
      ? "SE"
      : degree >= 157.5 && degree < 202.5
      ? "S"
      : degree >= 202.5 && degree < 247.5
      ? "SW"
      : degree >= 247.5 && degree < 292.5
      ? "W"
      : "NW";
  };

  const changeNeedle = () => {
    const next = degree;
    const last = lastNeedleAngle.current % 360;
    let diff = next - last;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const target = lastNeedleAngle.current + diff;
    lastNeedleAngle.current = target;

    Animated.timing(needleAnim, {
      toValue: target,
      duration: 280,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    askMagnetometerPermission({
      alertTitle: t("info.permission-needed"),
      alertMessage: t("sensor.magnetometer-permission"),
    });
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    setDirection(calculateDirection());
    changeNeedle();
  }, [degree, needleAnim]);

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
        alignItems: "center",
      }}
    >
      <TextOnBorder text="sensor.compass" />

      <ThemedView
        style={{
          width: COMPASS_SIZE,
          height: COMPASS_SIZE,
          borderRadius: COMPASS_SIZE,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 8,
          backgroundColor: theme.surface,
          borderColor: theme.error,
          ...commonStyles.shadow,
        }}
      >
        <ThemedView
          style={{
            width: INNER_CIRCLE_SIZE,
            height: INNER_CIRCLE_SIZE,
            borderRadius: INNER_CIRCLE_SIZE,
            backgroundColor: theme.surface,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: theme.accentBlue,
          }}
        >
          <Animated.View
            style={[
              {
                width: NEEDLE_SIZE,
                height: NEEDLE_SIZE,
                borderRadius: NEEDLE_SIZE,
                justifyContent: "center",
                alignItems: "center",
              },
              {
                transform: [
                  {
                    rotate: Animated.modulo(
                      Animated.multiply(needleAnim, -1),
                      360
                    ).interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Cardinal Directions */}
            <ThemedText
              type={TextType.XXL}
              bold
              style={{
                position: "absolute",
                top: 5,
                color: theme.error,
              }}
            >
              {t("sensor.cardinal.N")}
            </ThemedText>
            <ThemedText
              type={TextType.L}
              bold
              style={{
                position: "absolute",
                right: 5,
                transform: [{ rotate: "90deg" }],
              }}
            >
              {t("sensor.cardinal.E")}
            </ThemedText>
            <ThemedText
              type={TextType.L}
              bold
              style={{
                position: "absolute",
                bottom: 5,
                transform: [{ rotate: "360deg" }],
              }}
            >
              {t("sensor.cardinal.S")}
            </ThemedText>
            <ThemedText
              type={TextType.L}
              style={{
                position: "absolute",
                left: 5,
                transform: [{ rotate: "270deg" }],
              }}
            >
              {t("sensor.cardinal.W")}
            </ThemedText>

            {/* Intercardinal Directions */}
            <ThemedText
              type={TextType.SM}
              style={{
                position: "absolute",
                top: 52,
                right: 52,
                transform: [{ rotate: "45deg" }],
              }}
            >
              NE
            </ThemedText>
            <ThemedText
              type={TextType.SM}
              style={{
                position: "absolute",
                bottom: 52,
                right: 52,
                transform: [{ rotate: "135deg" }],
              }}
            >
              SE
            </ThemedText>
            <ThemedText
              type={TextType.SM}
              style={{
                position: "absolute",
                bottom: 52,
                left: 52,
                transform: [{ rotate: "225deg" }],
              }}
            >
              SW
            </ThemedText>
            <ThemedText
              type={TextType.SM}
              style={{
                position: "absolute",
                top: 52,
                left: 52,
                transform: [{ rotate: "315deg" }],
              }}
            >
              NW
            </ThemedText>

            {/* Needle */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: NEEDLE_SIZE,
                  height: NEEDLE_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                  ...commonStyles.shadow,
                },
                {
                  transform: [
                    {
                      rotate: Animated.modulo(needleAnim, 360).interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
              ]}
            >
              <ThemedView
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  top: 18,
                  borderLeftWidth: 8,
                  borderRightWidth: 8,
                  borderBottomWidth: NEEDLE_SIZE / 2 - 30,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderBottomColor: theme.error,
                  borderRadius: 4,
                }}
              />
              <ThemedView
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  bottom: 18,
                  borderLeftWidth: 8,
                  borderRightWidth: 8,
                  borderTopWidth: NEEDLE_SIZE / 2 - 30,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: theme.accentBlue,
                  borderRadius: 4,
                }}
              />
            </Animated.View>

            {/* Center Dot */}
            <ThemedView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: theme.primary,
                position: "absolute",
                borderWidth: 2,
                borderColor: theme.outline,
                ...commonStyles.shadow,
              }}
            />
          </Animated.View>
        </ThemedView>
      </ThemedView>
      <Pad height={16} />

      <ThemedView
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        <ThemedText type={TextType.XXL} bold style={{ color: theme.primary }}>
          {degree}°
        </ThemedText>
        <ThemedText
          type={TextType.XL}
          subBold
          style={{ color: theme.onSurface }}
        >
          {direction}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
