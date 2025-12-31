import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";

export default function SettingPage() {
  const theme = useTheme();
  const { user } = useUser();

  return <ThemedView style={{ flex: 1 }} useTheme></ThemedView>;
}
