import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import React, { useState } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextType, ThemedText } from "./ThemedText";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "tertiary";
  large?: boolean;
  textType?: TextType;
  loading?: boolean;
  disabled?: boolean;
  stretch?: boolean;
  width?: number | string;
} & React.ComponentProps<typeof TouchableOpacity>;

const CustomButton = React.forwardRef<TouchableOpacity, Props>(
  function CustomButton(
    {
      title,
      onPress,
      variant = "primary",
      large = false,
      textType = TextType.M,
      loading = false,
      disabled = false,
      stretch = false,
      width,
      ...otherProps
    }: Props,
    ref
  ) {
    const theme = useTheme();
    const commonStyle = useCommonStyles();
    const [pressed, setPressed] = useState(false);

    const styles = StyleSheet.create({
      container: {
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
      },
      primaryContainer: {
        backgroundColor: theme.primaryContainer,
        paddingHorizontal: 16,
        paddingVertical: large ? 16 : 8,
      },
      secondaryContainer: {
        backgroundColor: theme.secondaryContainer,
        paddingHorizontal: 16,
        paddingVertical: large ? 16 : 8,
      },
      tertiaryContainer: {
        backgroundColor: theme.tertiaryContainer,
        paddingHorizontal: 16,
        paddingVertical: large ? 16 : 8,
      },
      disabledContainer: {
        opacity: 0.5,
      },
      primaryText: {
        color: theme.onPrimaryContainer,
        fontWeight: "700",
      },
      secondaryText: {
        color: theme.onSecondaryContainer,
        fontWeight: "700",
      },
      tertiaryText: {
        color: theme.onSecondaryContainer,
        fontWeight: "700",
      },
    });

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.container,
          variant === "primary" ? styles.primaryContainer : undefined,
          variant === "secondary" ? styles.secondaryContainer : undefined,
          variant === "tertiary" ? styles.tertiaryContainer : undefined,
          disabled && styles.disabledContainer,
          stretch && { width: "100%" },
          !stretch && width && { width },
          !pressed && commonStyle.lightShadow,
        ]}
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessibilityRole="button"
        focusable
        {...otherProps}
      >
        {loading ? (
          <ActivityIndicator
            size={
              textType === TextType.XSM
                ? 20
                : textType === TextType.SM
                ? 22
                : textType === TextType.L
                ? 30
                : textType === TextType.XL
                ? 38
                : textType === TextType.XXL
                ? 38
                : textType === TextType.LINK
                ? 30
                : 24
            }
            color={variant === "primary" ? theme.text : theme.whiteText}
          />
        ) : (
          <ThemedText
            type={textType}
            style={[
              variant === "secondary"
                ? styles.secondaryText
                : variant === "tertiary"
                ? styles.tertiaryText
                : styles.primaryText,
            ]}
          >
            {title}
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  }
);

export default CustomButton;
