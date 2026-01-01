import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import React from "react";
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
  variant?: "primary" | "secondary";
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

    const styles = StyleSheet.create({
      container: {
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
      },
      primaryContainer: {
        backgroundColor: theme.onPrimaryContainer,
        paddingHorizontal: 16,
        paddingVertical: large ? 16 : 8,
      },
      secondaryContainer: {
        backgroundColor: theme.onSecondaryContainer,
        paddingHorizontal: 16,
        paddingVertical: large ? 16 : 8,
      },
      disabledContainer: {
        opacity: 0.5,
      },
      primaryText: {
        color: theme.onPrimary,
        fontWeight: "700",
      },
      secondaryText: {
        color: theme.onSecondary,
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
          disabled && styles.disabledContainer,
          stretch && { width: "100%" },
          !stretch && width && { width },
          commonStyle.shadow,
        ]}
        activeOpacity={0.8}
        onPress={onPress}
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
