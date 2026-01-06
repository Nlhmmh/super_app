import { ThemedText } from "@/components/ThemedText";
import { useUser } from "@/contexts";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import {
  launchImageLibraryAsync,
  PermissionStatus,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable } from "react-native";
import AssetImage from "./AssetImage";

const ImageUploader = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, saveUser } = useUser();
  const [image, setImage] = useState<string | undefined | null>(undefined);
  const [loading, setLoading] = useState(false);

  const storeImage = async (imageUri: string) => {
    if (!imageUri) {
      return null;
    }
    const fileName = imageUri.split("/").pop();
    const source = new File(imageUri);
    const destination = new File(Paths.document, fileName || "temp_image");
    source.copy(destination);
    return destination.uri;
  };

  const pickImage = useCallback(async () => {
    try {
      setLoading(true);
      const permission = await requestMediaLibraryPermissionsAsync();
      if (permission.status !== PermissionStatus.GRANTED) {
        Alert.alert(
          t("settings.permission-needed"),
          t("settings.photo-permission")
        );
        setLoading(false);
        return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        selectionLimit: 1,
        quality: 0.8,
        orderedSelection: true,
      });
      if (result.canceled) return;
      if (!result.assets || result.assets.length == 0) return;
      const uris = result.assets.map((asset) => asset.uri);
      const storedUri = await storeImage(uris[0]);
      setImage(storedUri || null);
      if (!user) return;
      await saveUser({
        ...user,
        profileImageUri: storedUri || undefined,
      });
    } catch (error) {
      Alert.alert(t("general.error"), t("settings.image-picker-error"));
    } finally {
      setLoading(false);
    }
  }, []);

  const removeImage = () => {
    setImage(null);
    if (!user) return;
    saveUser({
      ...user,
      profileImageUri: undefined,
    });
  };

  useEffect(() => {
    if (user?.profileImageUri) {
      setImage(user.profileImageUri);
    }
  }, [user]);

  const imageStyle = {
    flex: 1,
    height: 150,
    aspectRatio: 1,
    borderRadius: 150,
  };

  return (
    <Pressable
      onPress={pickImage}
      style={{
        flex: 1,
        height: 150,
        backgroundColor: theme.background,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 16,
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <Ionicons name="hourglass" size={24} color={theme.onBackground} />
          <ThemedText subBold style={{ color: theme.onBackground }}>
            {t("general.loading")}
          </ThemedText>
        </>
      ) : (
        <Pressable
          onPress={pickImage}
          onLongPress={removeImage}
          style={{
            height: 150,
            aspectRatio: 1,
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={imageStyle}
              contentFit="cover"
            />
          ) : (
            <AssetImage path="icon.png" style={imageStyle} />
          )}
        </Pressable>
      )}
    </Pressable>
  );
};

export default ImageUploader;
