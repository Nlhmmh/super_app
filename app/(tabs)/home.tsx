import Pad from "@/components/Pad";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function HomePage() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { user } = useUser();

  const ItemCard = ({
    iconName,
    text,
    onPress,
  }: {
    iconName: string;
    text: string;
    onPress: () => void;
  }) => {
    const [pressed, setPressed] = useState(false);
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.8}
        style={[
          {
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.secondary,
            borderRadius: 12,
            padding: 16,
            backgroundColor: theme.primaryContainer,
          },
          !pressed ? commonStyles.shadow : undefined,
        ]}
      >
        <Ionicons name={iconName} size={24} color={theme.onPrimaryContainer} />
        <ThemedText style={{ color: theme.onPrimaryContainer }}>
          {text}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={{ flex: 1, padding: 12 }} useTheme>
      <ThemedText type={TextType.XL}>
        Welcome, {user?.name || "Guest"}!
      </ThemedText>
      <Pad size={16} />
      <ItemCard
        iconName="radio"
        text="Radio"
        onPress={() => {
          router.push("/radio");
        }}
      />
    </ThemedView>
  );
}
