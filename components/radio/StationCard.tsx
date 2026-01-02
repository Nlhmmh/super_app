import AssetImage from "@/components/AssetImage";
import PriorityImage from "@/components/PriorityImage";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { station } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const StationCard = ({
  station,
  disabled,
  onPress,
}: {
  station: station;
  disabled?: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        {
          width: "100%",
          borderWidth: 1,
          borderRadius: 16,
          borderColor: theme.outline,
          backgroundColor: theme.primaryContainer,
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        },
        !pressed ? commonStyles.lightShadow : undefined,
        disabled ? { opacity: 0.5 } : undefined,
      ]}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      {station.favicon ? (
        <PriorityImage
          source={{ uri: station.favicon }}
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
      ) : (
        <AssetImage
          path="icon.png"
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
      )}
      <ThemedView style={{ flex: 1 }}>
        <ThemedText type={TextType.L} oneLineMode>
          {station.name}
        </ThemedText>
        <ThemedText oneLineMode>
          {station.country} | {station.language}
        </ThemedText>
        <ThemedText>Votes: {station.votes}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default StationCard;
