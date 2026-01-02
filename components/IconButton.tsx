import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Loading from "./Loading";
import { ThemedView } from "./ThemedView";

const IconButton = ({
  isOn,
  onIcon,
  offIcon,
  size = 24,
  color,
  style,
  loading,
  onPress,
}: TouchableOpacityProps & {
  isOn: boolean;
  onIcon: string;
  offIcon: string;
  size?: number;
  color?: string;
  loading?: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[style, { height: size }, pressed && commonStyles.shadow]}
      activeOpacity={0.9}
    >
      {loading ? (
        <ThemedView
          style={{
            width: size * 1.25,
            height: size * 1.25,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100%",
            backgroundColor: theme.onPrimaryContainer,
          }}
        >
          <Loading size="small" />
        </ThemedView>
      ) : (
        <Ionicons
          name={isOn ? onIcon : offIcon}
          size={size}
          color={color ? color : theme.onPrimaryContainer}
        />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;
