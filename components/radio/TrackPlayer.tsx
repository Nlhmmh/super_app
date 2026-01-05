import { useAudioPlayer } from "@/contexts";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import IconButton from "../IconButton";
import { ThemedText } from "../ThemedText";

const TrackPlayer = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { isPlaying, isLoading, currentTrack, play, pause } = useAudioPlayer();
  const [pressed, setPressed] = useState(false);

  const onPressPlayPause = async () => {
    if (!currentTrack) return;
    if (isPlaying) {
      await pause();
    } else {
      await play(currentTrack);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/radio/${currentTrack?.station.stationuuid}`)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <GlassView
        tintColor={isLiquidGlassAvailable() ? undefined : theme.background}
        style={{
          padding: 12,
          borderRadius: 12,
          gap: 8,
          alignItems: "center",
          backgroundColor: theme.background,
          ...(!pressed ? commonStyles.lightShadow : undefined),
        }}
      >
        <ThemedText>Now playing: {currentTrack?.title}</ThemedText>
        <IconButton
          isOn={isPlaying}
          onIcon="pause-circle"
          offIcon="play-circle"
          size={50}
          color={theme.onBackground}
          loading={isLoading}
          onPress={() => onPressPlayPause()}
          style={{ zIndex: 1000 }}
        />
      </GlassView>
    </TouchableOpacity>
  );
};

export default TrackPlayer;
