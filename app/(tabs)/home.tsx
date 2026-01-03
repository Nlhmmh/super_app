import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import Pad from "@/components/Pad";
import TrackPlayer from "@/components/radio/TrackPlayer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAudioPlayer } from "@/contexts";
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
  const { currentTrack } = useAudioPlayer();

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
            borderWidth: 0.2,
            borderColor: theme.outline,
            borderRadius: 12,
            padding: 12,
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
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle
        title={`Welcome ${user?.username || "Guest"}!`}
        showBack={false}
      />

      <ThemedView style={{ padding: 12 }}>
        <ItemCard
          iconName="radio"
          text="Radio"
          onPress={() => router.push("/radio")}
        />
      </ThemedView>

      {currentTrack && (
        <ThemedView style={{ position: "absolute", bottom: 80, alignSelf: "center" }}>
          <TrackPlayer />
          <Pad size={12} />
        </ThemedView>
      )}
    </ThemedView>
  );
}
