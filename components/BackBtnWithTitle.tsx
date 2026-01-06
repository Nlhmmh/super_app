import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const BackBtnWithTitle = ({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
}) => {
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/home");
  };

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: theme.background,
        ...commonStyles.lightShadow,
      }}
    >
      {showBack && (
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            left: 0,
            paddingHorizontal: 12,
            paddingVertical: 10,
            zIndex: 1,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      )}
      <ThemedView
        style={{
          flex: 1,
          justifyContent: showBack ? "center" : "flex-start",
          alignItems: showBack ? "center" : "flex-start",
          paddingHorizontal: showBack ? 25 : 0,
        }}
      >
        <ThemedText
          type={TextType.XL}
          style={{
            color: theme.text,
            flexShrink: 1,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default BackBtnWithTitle;
