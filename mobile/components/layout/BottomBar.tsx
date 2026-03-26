import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Trophy, Clock, Headphones, UserCircle } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../constants/theme";

const AVATAR_URI = require("../../assets/avatars/1.png");

const TAB_ICONS: Record<string, (color: string) => React.ReactNode> = {
  index: (color) => <Home size={22} color={color} />,
  prizes: (color) => <Trophy size={22} color={color} />,
  history: (color) => <Clock size={22} color={color} />,
  support: (color) => <Headphones size={22} color={color} />,
};

const TAB_LABELS: Record<string, string> = {
  index: "Início",
  prizes: "Prêmios",
  history: "Histórico",
  support: "Suporte",
  profile: "Perfil",
};

export function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? Colors.dark.primary : Colors.dark.textMuted;
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            {route.name === "profile" ? (
              isLoggedIn ? (
                <View style={[styles.avatarWrapper, isFocused && styles.avatarFocused]}>
                  <Image source={AVATAR_URI} style={styles.avatar} />
                </View>
              ) : (
                <UserCircle size={24} color={color} />
              )
            ) : (
              TAB_ICONS[route.name]?.(color)
            )}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.dark.inputBackground,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
  avatarWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.dark.textMuted,
  },
  avatarFocused: {
    borderColor: Colors.dark.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
