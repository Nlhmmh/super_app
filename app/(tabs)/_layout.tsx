import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <NavIcon
              iconName={"home"}
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused, color, size }) => (
            <NavIcon
              iconName={"settings"}
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const NavIcon = ({ iconName, focused, size, color }) => {
  const iconNameOutline = iconName + "-outline";
  return (
    <Ionicons
      name={focused ? iconName : iconNameOutline}
      size={size}
      color={color}
    />
  );
};
