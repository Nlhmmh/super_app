import AssetImage from "@/components/AssetImage";
import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomButton from "@/components/CustomButton";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Toggle from "@/components/Toggle";
import { useUser } from "@/contexts/UserContext";
import { ColorScheme, schemeStore } from "@/theme/schemeStore";
import { useTheme } from "@/theme/ThemeContext";
import { THEMES } from "@/utils/constants";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function SettingPage() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { user, countryCode, languageCode, clearUserLanguageAndCountry } =
    useUser();
  const [currentScheme, setCurrentScheme] = useState<ColorScheme | null>(
    THEMES[0]
  );

  useEffect(() => {
    (async () => {
      const stored = await schemeStore.get();
      setCurrentScheme(THEMES.find((t) => t.value == stored) || THEMES[0]);
    })();
  }, []);

  const changeTheme = (newTheme: ColorScheme) => {
    schemeStore.set(newTheme);
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Settings" showBack={false} />

      <ThemedView style={{ padding: 12, gap: 12 }}>
        <AssetImage
          path="icon.png"
          style={{
            width: "100%",
            height: 160,
            borderRadius: 12,
            alignSelf: "center",
          }}
        />
        <SettingCard title="Username">
          <ThemedText>{user?.username || "Guest"}</ThemedText>
        </SettingCard>
        <SettingCard title="Theme">
          <Toggle
            options={THEMES}
            initSel={currentScheme}
            onChange={(value) => changeTheme(value.value as ColorScheme)}
          />
        </SettingCard>
        <SettingCard title="Country">
          <ThemedText>{countryCode || "Unselected"}</ThemedText>
        </SettingCard>
        <SettingCard title="Language">
          <ThemedText>{languageCode || "Unselected"}</ThemedText>
        </SettingCard>
        <CustomButton
          title="Clear Setting"
          variant="primary"
          large
          onPress={() => {
            Alert.alert("Clear Settings", "Are you sure to clear settings?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: async () => await clearUserLanguageAndCountry(),
              },
            ]);
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const SettingCard = ({
  title,
  children,
}: {
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
        <ThemedText type={TextType.M} bold style={{ marginBottom: 4 }}>
          {title}
        </ThemedText>
        {children && <>{children}</>}
      </ThemedView>
    </ThemedView>
  );
};
