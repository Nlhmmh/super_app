import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function Compass() {
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Magnetometer.setUpdateInterval(1000);
  const _fast = () => Magnetometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((result) => {
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    text: {
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "stretch",
      marginTop: 15,
    },
    button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primaryContainer,
      padding: 10,
    },
    middleButton: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.secondaryContainer,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>Magnetometer:</ThemedText>
      <ThemedText style={styles.text}>x: {x}</ThemedText>
      <ThemedText style={styles.text}>y: {y}</ThemedText>
      <ThemedText style={styles.text}>z: {z}</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <ThemedText>{subscription ? "On" : "Off"}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <ThemedText>Slow</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <ThemedText>Fast</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
