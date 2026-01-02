import AssetImage from "@/components/AssetImage";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Toggle from "@/components/Toggle";
import { useUser } from "@/contexts/UserContext";
import { ColorScheme, schemeStore } from "@/theme/schemeStore";
import { useTheme } from "@/theme/ThemeContext";
import { THEMES } from "@/utils/constants";
import { useCommonStyles } from "@/utils/useCommonStyles";

export default function SettingPage() {
  const theme = useTheme();
  const { user, countryCode, languageCode } = useUser();

  const changeTheme = (newTheme: ColorScheme) => {
    schemeStore.set(newTheme);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 12, gap: 12 }} useTheme>
      <ThemedText type={TextType.XXL} style={{ alignSelf: "center" }} bold>
        Welcome to Super App
      </ThemedText>
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
          initSel={THEMES[0]}
          onChange={(value) => changeTheme(value.value as ColorScheme)}
        />
      </SettingCard>
      <SettingCard title="Country">
        <ThemedText>{countryCode || "Unselected"}</ThemedText>
      </SettingCard>
      <SettingCard title="Language">
        <ThemedText>{languageCode || "Unselected"}</ThemedText>
      </SettingCard>
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
