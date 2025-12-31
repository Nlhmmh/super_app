import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import AssetImage from "@/components/AssetImage";

export default function StartPage() {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const { isReady } = useUser();

  useEffect(() => {
    if (!isReady) return;
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 300);
    return () => clearTimeout(timeout);
  }, [isReady]);

  return (
    <ThemedView
      useTheme
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <AssetImage
        style={{
          width: 100,
          height: 100,
        }}
        path="icon.png"
      />
    </ThemedView>
  );
}
