import { useTheme } from "@/theme/ThemeContext";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

const Toggle = ({
  options,
  initSel,
  onChange,
}: {
  options: labelValuePair[];
  initSel: labelValuePair;
  onChange?: (value: labelValuePair) => void;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [sel, setSel] = useState<labelValuePair>(initSel);
  const [componentWidth, setComponentWidth] = useState(0);

  const pillAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(
    new Animated.Value(initSel === options[0] ? 0 : 1)
  ).current;
  const innerPadding = 8;
  const containerPadding = 4;
  const pillWidth = (componentWidth - innerPadding) / 2;

  useEffect(() => {
    handlePress(initSel);
  }, [initSel]);

  const handlePress = useCallback(
    (v: labelValuePair) => {
      if (v.value === sel.value) return;
      setSel(v);
      onChange && onChange(v);

      const toPillValue = v === options[0] ? 0 : pillWidth;
      const toTextValue = v === options[0] ? 0 : 1;
      Animated.parallel([
        Animated.timing(pillAnimation, {
          toValue: toPillValue,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimation, {
          toValue: toTextValue,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [sel, pillAnimation, textAnimation, pillWidth]
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setComponentWidth(width);
    const initialPos = initSel === options[0] ? 0 : (width - innerPadding) / 2;
    pillAnimation.setValue(initialPos);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: containerPadding,
      width: 120,
      height: 40,
      // overflow: "hidden",
      ...commonStyles.shadow,
    } as ViewStyle,
    optionWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    } as ViewStyle,
    activePill: {
      position: "absolute",
      height: "100%",
      backgroundColor: theme.primaryContainer,
      borderRadius: 16,
      top: containerPadding,
      bottom: containerPadding,
      left: containerPadding,
      ...commonStyles.lightShadow,
    } as ViewStyle,
    baseText: {
      fontSize: 14,
      fontWeight: "bold",
      lineHeight: 16,
    } as TextStyle,
  });

  const animatedPillStyle = {
    transform: [{ translateX: pillAnimation }],
    width: pillWidth,
  };

  const leftColor = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.onPrimary, theme.onPrimaryContainer],
  });
  const rightColor = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.onPrimaryContainer, theme.onPrimary],
  });

  const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

  return (
    <Animated.View
      style={styles.container as StyleProp<ViewStyle>}
      onLayout={onLayout}
    >
      {componentWidth > 0 && pillWidth > 0 && (
        <Animated.View style={[styles.activePill, animatedPillStyle]} />
      )}

      <Pressable
        style={styles.optionWrapper}
        onPress={() => handlePress(options[0])}
      >
        <AnimatedThemedText style={[styles.baseText, { color: leftColor }]}>
          {options[0].label}
        </AnimatedThemedText>
      </Pressable>

      <Pressable
        style={styles.optionWrapper}
        onPress={() => handlePress(options[1])}
      >
        <AnimatedThemedText style={[styles.baseText, { color: rightColor }]}>
          {options[1].label}
        </AnimatedThemedText>
      </Pressable>
    </Animated.View>
  );
};

export default Toggle;
