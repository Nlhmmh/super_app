import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
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

const CustomTabBar = (props: BottomTabBarProps) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { user } = useUser();
  const { state, descriptors, navigation } = props;
  let visibleRoutes = state.routes;

  return (
    <ThemedView
      style={{
        bottom: 0,
        position: "absolute",
        alignSelf: "center",
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
      }}
    >
      <BlurView
        intensity={100}
        tint="default"
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 8,
          ...commonStyles.shadow,
        }}
      >
        {visibleRoutes.map((route, index) => {
          return BottomNavRouteCard(
            descriptors,
            route,
            state,
            index,
            navigation
          );
        })}
      </BlurView>
    </ThemedView>
  );
};

const BottomNavRouteCard = (
  descriptors,
  route,
  state,
  index: number,
  navigation
) => {
  const theme = useTheme();
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
    <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7}>
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
