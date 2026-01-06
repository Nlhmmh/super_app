import AssetImage from "@/components/AssetImage";
import CustomButton from "@/components/CustomButton";
import FilteredSelectionModal from "@/components/FilteredSelectionModal";
import InputField from "@/components/InputField";
import Pad from "@/components/Pad";
import SelectBox from "@/components/SelectBox";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { DEVICE_LANGUAGES } from "@/i18n";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { validateField } from "@/utils/validation";
import { router } from "expo-router";
import i18next from "i18next";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";

export default function StartPage() {
  const { t } = useTranslation();
  const commonStyles = useCommonStyles();
  const { user, isReady, saveUser } = useUser();
  const { language, saveLanguage } = useLanguage();
  const nameRef = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [nameErrMsg, setNameErrMsg] = useState("");
  const btnRef = useRef<any>(null);
  const [openDeviceLanguageModal, setOpenDeviceLanguageModal] = useState(false);
  const [selDeviceLanguage, setSelDeviceLanguage] = useState<
    labelValuePair | undefined
  >(undefined);

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

  useEffect(() => {
    if (!isReady) return;
    if (user) router.replace("/home");
  }, [isReady, user]);

  useEffect(() => {
    setSelDeviceLanguage(
      DEVICE_LANGUAGES.find((v) => v.value === language) || DEVICE_LANGUAGES[0]
    );
  }, [language]);

  useEffect(() => {
    setOpenDeviceLanguageModal(false);
    i18next.changeLanguage(selDeviceLanguage?.value);
    saveLanguage?.(selDeviceLanguage?.value);
  }, [selDeviceLanguage, saveLanguage]);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        if (nameRef.current?.isFocused()) return;
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
            {t("start.welcome-message")}
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
              placeholder={t("start.name-placeholder")}
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
              <SelectBox
                options={DEVICE_LANGUAGES}
                sel={selDeviceLanguage}
                setSel={setSelDeviceLanguage}
              />
              <Pad height={16} />
              <CustomButton
                title={t("start.get-started")}
                onPress={onContinue}
                ref={btnRef}
              />
            </ThemedView>
          </ThemedView>

          <FilteredSelectionModal
            open={openDeviceLanguageModal}
            setOpen={setOpenDeviceLanguageModal}
            title={t("general.select-device-language")}
            placeholder={t("general.search-device-language")}
            allOptions={DEVICE_LANGUAGES}
            selectedValue={selDeviceLanguage}
            onSelect={setSelDeviceLanguage}
            defaultOption={DEVICE_LANGUAGES[0]}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}
