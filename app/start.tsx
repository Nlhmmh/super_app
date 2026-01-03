import AssetImage from "@/components/AssetImage";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import Pad from "@/components/Pad";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { validateField } from "@/utils/validation";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

export default function StartPage() {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const { user, isReady, saveUser } = useUser();
  const nameRef = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [nameErrMsg, setNameErrMsg] = useState("");
  const btnRef = useRef<any>(null);

  useEffect(() => {
    if (!isReady) return;
    if (user) router.replace("/home");
  }, [isReady, user]);

  // Handle field changes
  const handleNameChange = (text: string) => {
    setName(text);
    const validation = validateField(text, "Name");
    setNameErrMsg(validation.error);
  };

  const onContinue = async () => {
    const nameValidation = validateField(name, "Name");
    setNameErrMsg(nameValidation.error);
    if (nameValidation.error) return;
    await saveUser({
      id: 1,
      username: name,
      email: "",
      token: "",
      phone: "",
    });
    router.replace("/home");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ThemedView
          useTheme
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
          }}
        >
          <ThemedText bold type={TextType.XXL}>
            Welcome to Super App
          </ThemedText>
          <Pad height={16} />
          <AssetImage
            style={{
              width: 200,
              aspectRatio: 1,
              borderRadius: 24,
            }}
            path="icon.png"
          />
          <Pad height={16} />

          <ThemedView style={{ width: "100%", alignSelf: "center" }}>
            <InputField
              hideLabel
              placeholder={"Hello Guest! Please enter your name..."}
              value={name}
              onChangeText={handleNameChange}
              errorMsg={nameErrMsg}
              inputRef={nameRef}
              returnKeyType="next"
              onSubmitEditing={() => onContinue()}
              alignCenter
            />
            <Pad height={16} />
            <ThemedView style={{ width: "80%", alignSelf: "center" }}>
              <CustomButton
                title="Continue"
                onPress={onContinue}
                ref={btnRef}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
