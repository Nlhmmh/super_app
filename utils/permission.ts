import * as Brightness from "expo-brightness";
import * as Cellular from "expo-cellular";
import { PermissionStatus } from "expo-modules-core";
import { Magnetometer } from "expo-sensors";
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

export const askBrightnessPermission = async ({
  alertTitle,
  alertMessage,
}: {
  alertTitle: string;
  alertMessage: string;
}) => {
  const { status } = await Brightness.getPermissionsAsync();
  if (status === PermissionStatus.GRANTED) {
    return;
  }
  const result = await Brightness.requestPermissionsAsync();
  if (result.status !== PermissionStatus.GRANTED) {
    Alert.alert(
      alertTitle || "Permission Needed",
      alertMessage ||
        "Without brightness permission, the app cannot read or adjust the screen brightness."
    );
  }
};

export const askCellularPermission = async ({
  alertTitle,
  alertMessage,
}: {
  alertTitle: string;
  alertMessage: string;
}) => {
  const { status } = await Cellular.getPermissionsAsync();
  if (status === PermissionStatus.GRANTED) {
    return;
  }
  const result = await Cellular.requestPermissionsAsync();
  if (result.status !== PermissionStatus.GRANTED) {
    Alert.alert(
      alertTitle || "Permission Needed",
      alertMessage ||
        "Without battery permission, the app cannot access battery information."
    );
  }
};

export const askMagnetometerPermission = async ({
  alertTitle,
  alertMessage,
}: {
  alertTitle: string;
  alertMessage: string;
}) => {
  const { status } = await Magnetometer.getPermissionsAsync();
  if (status === PermissionStatus.GRANTED) {
    return;
  }
  const result = await Magnetometer.requestPermissionsAsync();
  if (result.status !== PermissionStatus.GRANTED) {
    Alert.alert(
      alertTitle || "Permission Needed",
      alertMessage ||
        "Without magnetometer permission, the compass feature will not work."
    );
  }
};
