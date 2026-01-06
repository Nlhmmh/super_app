import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TextInput, TouchableOpacity } from "react-native";
import { ThemedView } from "./ThemedView";

export default function SearchBar({
  placeholder,
  searchText,
  setSearchText,
  onPressCountryOptions,
  onPressLanguageOptions,
  onPressFavourites,
}: {
  placeholder: string;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  onPressCountryOptions?: () => void;
  onPressLanguageOptions?: () => void;
  onPressFavourites?: () => void;
}) {
  const { theme } = useTheme();
  const searchBarColors = {
    textColor: theme.accentBlue,
    iconColor: theme.accentBlue,
    background: theme.background,
    borderColor: theme.outline,
    placeholderColor: theme.accentBlue,
  };
  return (
    <ThemedView
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: searchBarColors.background,
        paddingHorizontal: 16,
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
          color: searchBarColors.textColor,
        }}
        placeholderTextColor={searchBarColors.placeholderColor}
        placeholder={placeholder}
      />
      {onPressCountryOptions && (
        <TouchableOpacity onPress={onPressCountryOptions}>
          <Ionicons
            name="earth-outline"
            size={24}
            color={searchBarColors.iconColor}
          />
        </TouchableOpacity>
      )}
      {onPressLanguageOptions && (
        <TouchableOpacity onPress={onPressLanguageOptions}>
          <Ionicons
            name="language-outline"
            size={24}
            color={searchBarColors.iconColor}
          />
        </TouchableOpacity>
      )}
      {onPressFavourites && (
        <TouchableOpacity onPress={onPressFavourites}>
          <Ionicons name="heart" size={24} color={searchBarColors.iconColor} />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
