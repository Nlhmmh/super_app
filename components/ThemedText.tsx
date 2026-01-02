import { useTheme } from "@/theme/ThemeContext";
import * as Clipboard from "expo-clipboard";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextProps,
} from "react-native";

export enum TextType {
  XSM = "xsm",
  SM = "sm",
  M = "m",
  L = "l",
  XL = "xl",
  XXL = "xxl",
  LINK = "link",
  OPEN_LINK = "open_link",
  ERROR = "error",
}

export function ThemedText({
  type = TextType.M,
  bold = false,
  subBold = false,
  link,
  oneLineMode,
  style,
  ...rest
}: TextProps & {
  type?: TextType;
  bold?: boolean;
  subBold?: boolean;
  link?: string;
  oneLineMode?: boolean;
}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    xsm: {
      fontSize: 10,
      lineHeight: 20,
    },
    sm: {
      fontSize: 12,
      lineHeight: 22,
    },
    m: {
      fontSize: 14,
      lineHeight: Platform.OS === "ios" ? 26 : 24,
    },
    l: {
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 30,
    },
    xl: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 38,
    },
    xxl: {
      fontSize: 24,
      fontWeight: "700",
      lineHeight: Platform.OS === "ios" ? 46 : 38,
    },
    link: {
      fontSize: 14,
      lineHeight: Platform.OS === "ios" ? 26 : 24,
      textDecorationLine: "underline",
      color: theme.accentBlue,
    },
    error: {
      color: "red",
    },
    subBold: {
      fontWeight: "500",
    },
    bold: {
      fontWeight: "700",
    },
  });

  if (type === TextType.LINK || type === TextType.OPEN_LINK) {
    return (
      <TouchableOpacity
        onPress={async () => {
          if (!link) return;
          if (type === TextType.LINK) {
            await Clipboard.setStringAsync(link);
            return;
          }
          if (type === TextType.OPEN_LINK) {
            try {
              const supported = await Linking.canOpenURL(link);
              if (supported) {
                await Linking.openURL(link);
              }
            } catch (e) {
              // ignore
            }
          }
        }}
        activeOpacity={!link ? 1 : 0.8}
        style={[
          style,
          {
            flexDirection: "row",
          },
        ]}
      >
        <Text
          style={[styles.link, style]}
          numberOfLines={oneLineMode ? 1 : undefined}
          ellipsizeMode={oneLineMode ? "tail" : undefined}
          {...rest}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Text
      style={[
        type === TextType.XSM ? styles.xsm : undefined,
        type === TextType.SM ? styles.sm : undefined,
        type === TextType.M ? styles.m : undefined,
        type === TextType.L ? styles.l : undefined,
        type === TextType.XL ? styles.xl : undefined,
        type === TextType.XXL ? styles.xxl : undefined,
        type === TextType.LINK ? styles.link : undefined,
        type === TextType.ERROR ? styles.error : undefined,
        bold ? styles.bold : undefined,
        subBold ? styles.subBold : undefined,
        style,
        {
          color: theme.onBackground,
        },
      ]}
      numberOfLines={oneLineMode ? 1 : undefined}
      ellipsizeMode={oneLineMode ? "tail" : undefined}
      {...rest}
    />
  );
}
