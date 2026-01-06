import { useTheme } from "@/theme/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomScrollView = ({
  children,
  childGrow = false,
  avoidKeyboard = true,
  keyboardOffset,
  refreshing = false,
  onRefresh,
  scrollable = true,
  onPressOutside,
  ...rest
}: ScrollViewProps & {
  children: React.ReactNode;
  childGrow?: boolean;
  avoidKeyboard?: boolean;
  keyboardOffset?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollable?: boolean;
  onPressOutside?: () => void;
}) => {
  const headerHeight = useHeaderHeight?.() ?? 0;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const verticalOffset =
    typeof keyboardOffset === "number"
      ? keyboardOffset
      : headerHeight + insets.top;

  const scroll = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={!!onRefresh || false}
      alwaysBounceVertical={Platform.OS === "ios" ? !!onRefresh : undefined}
      overScrollMode="never"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      contentInsetAdjustmentBehavior={
        Platform.OS === "ios" ? "always" : undefined
      }
      contentContainerStyle={{ flexGrow: childGrow ? 1 : undefined }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressViewOffset={
              Platform.OS === "android" ? verticalOffset : undefined
            }
          />
        ) : undefined
      }
      scrollEnabled={scrollable}
      {...rest}
    >
      {onPressOutside ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressOutside}
          style={{ flex: 1 }}
        >
          {children}
        </TouchableOpacity>
      ) : (
        children
      )}
    </ScrollView>
  );

  if (!avoidKeyboard) return scroll;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? verticalOffset : 0}
    >
      {scroll}
    </KeyboardAvoidingView>
  );
};

export default CustomScrollView;
