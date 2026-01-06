import Pad from "@/components/Pad";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, TextInput } from "react-native";

export type InputFieldProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  errorMsg: string;
  inputRef: React.RefObject<TextInput | null>;
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
  zIndex?: number;
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
  const { theme } = useTheme();
  return (
    <ThemedView
      style={{
        alignItems: alignCenter ? "center" : "flex-start",
      }}
    >
      {!hideLabel && (
        <>
          <ThemedText bold style={{ color: theme.onBackground }}>
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
          borderColor: errorMsg !== "" ? theme.error : theme.onBackground,
        }}
      >
        {icon && (
          <Ionicons name={icon as any} size={20} color={theme.onBackground} />
        )}
        <TextInput
          style={{
            color: theme.onBackground,
            textAlign: alignCenter ? "center" : "left",
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.onBackground + "99"}
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
        />
        {onTogglePassword && (
          <Pressable onPress={onTogglePassword}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={theme.onBackground}
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
