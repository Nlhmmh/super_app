import Pad from "@/components/Pad";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, TextInput } from "react-native";

export type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  errorMsg: string;
  inputRef: React.RefObject<TextInput>;
  returnKeyType: "next" | "done";
  onSubmitEditing?: () => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "url"
    | "number-pad"
    | "numbers-and-punctuation";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  textContentType?: string;
  autoComplete?: string;
  hideLabel?: boolean;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  alignCenter?: boolean;
};

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  errorMsg,
  inputRef,
  returnKeyType,
  onSubmitEditing,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect,
  textContentType,
  autoComplete,
  hideLabel,
  secureTextEntry,
  showPassword,
  onTogglePassword,
  alignCenter,
}: InputFieldProps) {
  const theme = useTheme();
  return (
    <ThemedView
      style={{
        width: "100%",
        alignSelf: "center",
        alignItems: alignCenter ? "center" : "flex-start",
      }}
    >
      {!hideLabel && (
        <>
          <ThemedText bold style={{ color: theme.onSecondaryContainer }}>
            {label}
          </ThemedText>
          <Pad height={8} />
        </>
      )}
      <ThemedView
        style={{
          paddingHorizontal: 12,
          paddingVertical: Platform.OS === "ios" ? 16 : 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderBottomWidth: 1,
          borderColor: errorMsg !== "" ? theme.error : theme.outline,
        }}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={theme.onSecondaryContainer}
          />
        )}
        <TextInput
          style={{ color: theme.onSecondaryContainer, flex: 1 }}
          placeholder={placeholder}
          placeholderTextColor={theme.onSecondaryContainer + "99"}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          ref={inputRef}
          blurOnSubmit={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType as any}
          autoComplete={autoComplete as any}
          secureTextEntry={secureTextEntry}
          style={{ textAlign: alignCenter ? "center" : "left" }}
        />
        {onTogglePassword && (
          <Pressable onPress={onTogglePassword}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={theme.onSecondaryContainer}
            />
          </Pressable>
        )}
      </ThemedView>
      {errorMsg !== "" && (
        <>
          <Pad height={4} />
          <ThemedText type={TextType.ERROR}>{errorMsg}</ThemedText>
        </>
      )}
    </ThemedView>
  );
}
