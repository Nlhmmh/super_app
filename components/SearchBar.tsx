import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TextInput } from "react-native";
import { ThemedView } from "./ThemedView";

export default function SearchBar({
  placeholder,
  searchText,
  setSearchText,
}: {
  placeholder: string;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const theme = useTheme();
  const searchBarColors = {
    textColor: theme.onBackground,
    iconColor: theme.onBackground,
    background: theme.background,
    borderColor: theme.outline,
    placeholderColor: theme.tint,
  };
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: searchBarColors.background,
        paddingHorizontal:  16,
        paddingVertical: Platform.OS === "ios" ? 16 : 8,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: searchBarColors.borderColor,
        gap: 10,
      }}
    >
      <Ionicons
        name="search-outline"
        size={24}
        color={searchBarColors.iconColor}
      />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        style={{
          flex: 1,
          fontSize: 16,
          lineHeight: 18,
          color: searchBarColors.textColor,
        }}
        placeholderTextColor={searchBarColors.placeholderColor}
        placeholder={placeholder}
      />
    </ThemedView>
  );
}
