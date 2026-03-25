import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useSearch } from "../contexts/SearchContext";
import { Colors } from "../constants/theme";

interface Props {
  label: string;
  icon: number;
}

export function CategoryButton({ label, icon }: Props) {
  const { activeCategory, toggleCategory } = useSearch();
  const isActive = activeCategory === label;

  const shadowOpacity = useSharedValue(0);

  useEffect(() => {
    shadowOpacity.value = withTiming(isActive ? 1 : 0, { duration: 150 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    toggleCategory(label);
  };

  return (
    <View style={styles.outer}>
      <Pressable onPressIn={handlePressIn}>
        <Animated.View
          style={[styles.inner, activeCategory && (isActive ? styles.active : styles.inactive), animStyle]}
        >
          <LinearGradient
            colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  inner: {
    borderRadius: 15,
    width: "100%",
    backgroundColor: Colors.dark.background,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
  },
  active: {
    shadowOpacity: 1,
  },
  inactive: {
    opacity: 0.7,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    aspectRatio: 1,
  },
  icon: {
    width: "100%",
    height: "100%",
  },
  label: {
    color: Colors.dark.text,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
});
