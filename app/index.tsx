import AssetImage from "@/components/AssetImage";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function IndexPage() {
  const { isReady } = useUser();

  useEffect(() => {
    if (!isReady) return;
    const timeout = setTimeout(() => {
      router.replace("/start");
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
          width: 200,
          aspectRatio: 1,
          borderRadius: 24,
        }}
        path="icon.png"
      />
    </ThemedView>
  );
}
