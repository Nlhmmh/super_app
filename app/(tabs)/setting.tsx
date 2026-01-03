import AssetImage from "@/components/AssetImage";
import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomButton from "@/components/CustomButton";
import CustomScrollView from "@/components/CustomScrollView";
import FilteredSelectionModal from "@/components/FilteredSelectionModal";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Toggle from "@/components/Toggle";
import { useCountryCode } from "@/contexts/CountryCodeContext";
import { useLanguageCode } from "@/contexts/LanguageCodeContext";
import { useUser } from "@/contexts/UserContext";
import { ColorScheme, schemeStore } from "@/theme/schemeStore";
import { useTheme } from "@/theme/ThemeContext";
import { COUNTRY_CODES, LANGUAGES, THEMES } from "@/utils/constants";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

export default function SettingPage() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { user, saveUser, clearUser } = useUser();
  const { countryCode, saveCountryCode, clearCountryCode } = useCountryCode();
  const { languageCode, saveLanguageCode, clearLanguageCode } =
    useLanguageCode();
  const [currentScheme, setCurrentScheme] = useState<ColorScheme | null>(
    THEMES[0]
  );
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [selCountry, setSelCountry] = useState<labelValuePair | undefined>(
    undefined
  );
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [selLanguage, setSelLanguage] = useState<labelValuePair | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const stored = await schemeStore.get();
      setCurrentScheme(THEMES.find((t) => t.value == stored) || THEMES[0]);
    })();
  }, []);

  useEffect(() => {
    if (!countryCode) return;
    setSelCountry(COUNTRY_CODES.find((v) => v.value === countryCode));
  }, [countryCode]);

  useEffect(() => {
    if (!languageCode) return;
    setSelLanguage(LANGUAGES.find((v) => v.value === languageCode));
  }, [languageCode]);

  useEffect(() => {
    setOpenCountryModal(false);
    saveCountryCode(selCountry?.value || "");
  }, [selCountry, saveCountryCode]);

  useEffect(() => {
    setOpenLanguageModal(false);
    saveLanguageCode?.(selLanguage?.value || "");
  }, [selLanguage, saveLanguageCode]);

  const changeTheme = (newTheme: ColorScheme) => {
    schemeStore.set(newTheme);
  };

  const onClearSettings = () => {
    Alert.alert("Clear Settings", "Are you sure to clear settings?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await clearUser();
          await clearCountryCode();
          await clearLanguageCode();
          schemeStore.clear();
          setCurrentScheme(THEMES[0]);
          changeTheme(THEMES[0]);
        },
      },
    ]);
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Settings" showBack={false} />

      <TouchableWithoutFeedback
        onPress={() => {
          setUsernameEditable(false);
          Keyboard.dismiss();
        }}
      >
        <CustomScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
          <AssetImage
            path="icon.png"
            style={{
              width: "100%",
              height: 160,
              borderRadius: 12,
              alignSelf: "center",
            }}
          />

          <SettingCard title="Username" icon="person">
            <TouchableOpacity
              onPress={() => setUsernameEditable(!usernameEditable)}
              activeOpacity={0.8}
              style={{ ...commonStyles.lightShadow }}
            >
              {!usernameEditable && (
                <ThemedText>{user?.username || "Guest"}</ThemedText>
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

          <SettingCard title="Theme" icon="color-palette">
            <Toggle
              options={THEMES}
              initSel={currentScheme}
              onChange={(value) => changeTheme(value.value as ColorScheme)}
            />
          </SettingCard>

          <SettingCard title="Country" icon="globe">
            <TouchableOpacity
              onPress={() => setOpenCountryModal(true)}
              activeOpacity={0.8}
              style={{ ...commonStyles.lightShadow }}
            >
              <ThemedText>
                {countryCode ||
                  (user?.countryCode ? user.countryCode : "Unselected")}
              </ThemedText>
            </TouchableOpacity>
          </SettingCard>

          <SettingCard title="Language" icon="language">
            <TouchableOpacity
              onPress={() => setOpenLanguageModal(true)}
              activeOpacity={0.8}
              style={{ ...commonStyles.lightShadow }}
            >
              <ThemedText>
                {languageCode ||
                  (user?.languageCode ? user.languageCode : "Unselected")}
              </ThemedText>
            </TouchableOpacity>
          </SettingCard>

          <CustomButton
            title="Clear Setting"
            variant="tertiary"
            large
            onPress={onClearSettings}
          />
        </CustomScrollView>
      </TouchableWithoutFeedback>

      <FilteredSelectionModal
        open={openCountryModal}
        setOpen={setOpenCountryModal}
        title="Select Country"
        placeholder="Search Country"
        allOptions={COUNTRY_CODES}
        selectedValue={selCountry}
        onSelect={setSelCountry}
        defaultOption={COUNTRY_CODES[0]}
      />

      <FilteredSelectionModal
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        title="Select Language"
        placeholder="Search Language"
        allOptions={LANGUAGES}
        selectedValue={selLanguage}
        onSelect={setSelLanguage}
        defaultOption={LANGUAGES[0]}
      />
    </ThemedView>
  );
}

const SettingCard = ({
  icon,
  title,
  children,
}: {
  icon?: string;
  title: string;
  children?: React.ReactNode;
}) => {
  const theme = useTheme();
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
            name={icon || "settings-outline"}
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
