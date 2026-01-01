import { Alert, PermissionsAndroid, Platform } from "react-native";

export const askNotificationPermission = async () => {
  // Ask for notification permission on Android 13+ so the player can show its foreground notification.
  if (Platform.OS !== "android") return;
  if (Platform.Version < 33) return;
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    Alert.alert(
      "Notification Permission Denied",
      "Without notification permission, the radio may stop playing when the app is in the background."
    );
  }
};
