import { useTheme } from "@/theme/ThemeContext";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Pressable, ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const CustomDropdown = ({
  list,
  isOpen,
  setIsOpen,
  selected,
  setSelected,
  icon = "location",
  parentScrollable = true,
  setParentScrollable,
}: {
  list: labelValuePair[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selected: labelValuePair | null;
  setSelected: (value: labelValuePair | null) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  parentScrollable?: boolean;
  setParentScrollable?: (scrollable: boolean) => void;
}) => {
  const theme = useTheme();
  const commonStyle = useCommonStyles();

  const handleSelectChange = useCallback(
    (value: { value: string; label: string }) => {
      setSelected(value);
      setIsOpen(false);
      setParentScrollable?.(true); // Re-enable parent scroll
    },
    [setSelected, setIsOpen, setParentScrollable]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setParentScrollable?.(true); // Re-enable parent scroll
  }, [setIsOpen, setParentScrollable]);

  // Cleanup: Re-enable parent scroll when component unmounts or dropdown closes
  useEffect(() => {
    if (!isOpen) setParentScrollable?.(true);
  }, [isOpen, setParentScrollable]);

  return (
    <ThemedView
      style={{
        position: "relative",
      }}
    >
      <Pressable
        style={{
          borderRadius: 32,
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          ...commonStyle.lightShadow,
        }}
        onPress={() => {
          const willOpen = !isOpen;
          setParentScrollable?.(!willOpen); // Disable parent scroll when opening
          setIsOpen(willOpen);
        }}
      >
        <Ionicons name={icon} size={20} color={theme.textTint} />
        <ThemedText style={{ color: theme.onBackground }}>
          {selected ? selected.label : "Select an option"}
        </ThemedText>
      </Pressable>

      {isOpen && (
        <ThemedView
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            zIndex: 1,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: theme.secondary,
          }}
        >
          <ScrollView
            style={{ maxHeight: 200, zIndex: 100 }}
            // nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {list.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => handleSelectChange(item)}
              >
                <ThemedText
                  style={{
                    padding: 10,
                    color: theme.onSecondary,
                  }}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default CustomDropdown;
