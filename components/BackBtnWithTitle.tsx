import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const BackBtnWithTitle = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        style={{ position: "absolute", left: 0, padding: 10, zIndex: 1 }}
      >
        <Ionicons name="arrow-back" size={20} color={theme.text} />
      </TouchableOpacity>
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 25,
        }}
      >
        <ThemedText
          type={TextType.XL}
          style={{
            color: theme.text,
            textAlign: "center",
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
