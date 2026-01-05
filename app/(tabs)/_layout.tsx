import { TextType, ThemedText } from "@/components/ThemedText";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
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

const NavIcon = ({
  iconName,
  focused,
  size,
  color,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size: number;
  color: string;
}) => {
  const iconNameOutline = iconName + "-outline";
  return (
    <Ionicons
      name={
        focused ? iconName : (iconNameOutline as keyof typeof Ionicons.glyphMap)
      }
      size={size}
      color={color}
    />
  );
};

const CustomTabBar = (props: BottomTabBarProps) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { user } = useUser();
  const { state, descriptors, navigation } = props;
  let visibleRoutes = state.routes;

  return (
    <GlassView
      tintColor={isLiquidGlassAvailable() ? undefined : theme.background}
      style={{
        position: "absolute",
        bottom: 10,
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: isLiquidGlassAvailable()
          ? "transparent"
          : theme.surface,
        ...commonStyles.lightShadow,
      }}
    >
      {visibleRoutes.map((route, index) => {
        return BottomNavRouteCard(descriptors, route, state, index, navigation);
      })}
    </GlassView>
  );
};

const BottomNavRouteCard = (
  descriptors: BottomTabBarProps["descriptors"],
  route: BottomTabBarProps["state"]["routes"][0],
  state: BottomTabBarProps["state"],
  index: number,
  navigation: BottomTabBarProps["navigation"]
) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { options } = descriptors[route.key];
  const isFocused = state.routes[state.index].key === route.key;
  const { tabBarIcon, title } = options;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isFocused ? theme.primaryContainer : "rgba(0, 0, 0, 0)",
        { duration: 250 }
      ),
    };
  }, [isFocused]);

  return (
    <TouchableOpacity
      key={route.key}
      onPress={onPress}
      activeOpacity={0.8}
      style={[isFocused ? commonStyles.lightShadow : undefined]}
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            borderRadius: 32,
            paddingHorizontal: 16,
            paddingVertical: 12,
          },
          animatedTabStyle,
        ]}
      >
        {tabBarIcon &&
          tabBarIcon({
            focused: isFocused,
            color: theme.onPrimaryContainer,
            size: 24,
          })}
        <Animated.View>
          <ThemedText
            type={TextType.SM}
            bold
            style={{
              color: theme.onPrimaryContainer,
            }}
          >
            {title || route.name}
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};
