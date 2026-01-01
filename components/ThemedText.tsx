import { useTheme } from "@/theme/ThemeContext";
import * as Clipboard from "expo-clipboard";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextProps
} from "react-native";

export enum TextType {
  XSM = "xsm",
  SM = "sm",
  M = "m",
  L = "l",
  XL = "xl",
  XXL = "xxl",
  LINK = "link",
  ERROR = "error",
}

export function ThemedText({
  type = TextType.DEFAULT,
  bold = false,
  subBold = false,
  link,
  style,
  ...rest
}: TextProps & {
  type?: TextType;
  bold?: boolean;
  subBold?: boolean;
  link?: string;
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
      lineHeight: 24,
      fontWeight: "500",
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

  if (type === TextType.LINK) {
    return (
      <TouchableOpacity
        onPress={async () => {
          if (!link) return;
          await Clipboard.setStringAsync(link);
          // const supported = await Linking.canOpenURL(link || "");
          // if (!supported) return;
          // await Linking.openURL(link || "");
        }}
        activeOpacity={!link ? 1 : 0.8}
      >
        <Text style={[!link ? styles.m : styles.link, style]} {...rest} />
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
      ]}
      {...rest}
    />
  );
}
