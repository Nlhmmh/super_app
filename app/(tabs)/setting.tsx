import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomButton from "@/components/CustomButton";
import CustomScrollView from "@/components/CustomScrollView";
import FilteredSelectionModal from "@/components/FilteredSelectionModal";
import ImageUploader from "@/components/ImageUploader";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Toggle from "@/components/Toggle";
import { useAudioPlayer } from "@/contexts";
import { useCountryCode } from "@/contexts/CountryCodeContext";
import { useLanguageCode } from "@/contexts/LanguageCodeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { DEVICE_LANGUAGES } from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { THEMES } from "@/utils/constants";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ColorSchemeName,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

export default function SettingPage() {
  const { t } = useTranslation();
  const { theme, scheme, saveScheme, clearScheme } = useTheme();
  const commonStyles = useCommonStyles();
  const { user, saveUser, clearUser } = useUser();
  const { clearCountryCode } = useCountryCode();
  const { clearLanguageCode } = useLanguageCode();
  const { language, saveLanguage, clearLanguage } = useLanguage();
  const { clearCurrentStation } = useAudioPlayer();
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [openDeviceLanguageModal, setOpenDeviceLanguageModal] = useState(false);
  const [selDeviceLanguage, setSelDeviceLanguage] = useState<
    labelValuePair | undefined
  >(undefined);

  const changeTheme = (newTheme: ColorSchemeName) => {
    saveScheme(newTheme);
  };

  const onClearSettings = () => {
    Alert.alert(
      t("settings.clear-settings-title"),
      t("settings.clear-settings-message"),
      [
        {
          text: t("general.cancel"),
          style: "cancel",
        },
        {
          text: t("general.ok"),
          onPress: async () => {
            await clearUser();
            await clearLanguage();
            await clearCountryCode();
            await clearLanguageCode();
            await clearCurrentStation();
            await clearScheme();
          },
        },
      ]
    );
  };

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
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("settings.settings")} showBack={false} />

      <TouchableWithoutFeedback
        onPress={() => {
          setUsernameEditable(false);
          Keyboard.dismiss();
        }}
      >
        <CustomScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
          <ImageUploader />

          <SettingCard title={t("general.username")} icon="person">
            <TouchableOpacity
              onPress={() => setUsernameEditable(!usernameEditable)}
              activeOpacity={0.8}
              style={{ ...commonStyles.lightShadow }}
            >
              {!usernameEditable && (
                <ThemedText>{user?.username || t("general.guest")}</ThemedText>
              )}
              {usernameEditable && (
                <TextInput
                  autoFocus
                  value={username}
                  onChangeText={setUsername}
                  onSubmitEditing={() => {
                    saveUser({ ...user, username });
                    setUsernameEditable(false);
                  }}
                  style={{
                    color: theme.onSecondaryContainer,
                    borderBottomWidth: 1,
                    borderColor: theme.outline,
                  }}
                />
              )}
            </TouchableOpacity>
          </SettingCard>

          <SettingCard title={t("general.theme")} icon="color-palette">
            <Toggle
              options={THEMES}
              initSel={THEMES.find((t) => t.value === scheme) || THEMES[0]}
              onChange={(value) => changeTheme(value.value as ColorSchemeName)}
            />
          </SettingCard>

          <SettingCard title={t("general.device-language")} icon="language">
            <TouchableOpacity
              onPress={() => setOpenDeviceLanguageModal(true)}
              activeOpacity={0.8}
              style={{ ...commonStyles.lightShadow }}
            >
              <ThemedText>
                <>
                  {DEVICE_LANGUAGES.find((v) => v.value === language)?.label ||
                    DEVICE_LANGUAGES[0].label}
                </>
              </ThemedText>
            </TouchableOpacity>
          </SettingCard>

          <CustomButton
            title={t("settings.clear-settings-title")}
            variant="tertiary"
            large
            onPress={onClearSettings}
          />
        </CustomScrollView>
      </TouchableWithoutFeedback>

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
  );
}

const SettingCard = ({
  icon,
  title,
  children,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  children?: React.ReactNode;
}) => {
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <ThemedView
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor: theme.secondaryContainer,
        height: 60,
        justifyContent: "center",
        ...commonStyles.lightShadow,
      }}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <ThemedView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons
            name={
              icon || ("settings-outline" as keyof typeof Ionicons.glyphMap)
            }
            size={20}
            color={theme.onSecondaryContainer}
          />
          <ThemedText
            type={TextType.M}
            bold
            style={{ color: theme.onSecondaryContainer }}
          >
            {title}
          </ThemedText>
        </ThemedView>
        {children && <>{children}</>}
      </ThemedView>
    </ThemedView>
  );
};
