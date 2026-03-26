import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/theme";

export function FavoriteButton() {
  const [favorited, setFavorited] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.circle, favorited && styles.circleFavorited]}
      onPress={() => setFavorited((v) => !v)}
      activeOpacity={0.75}
    >
      <Text style={[styles.icon, favorited && styles.iconFavorited]}>★</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  circleFavorited: {
    backgroundColor: Colors.dark.secondary,
  },
  icon: {
    color: Colors.dark.card,
    fontSize: 14,
  },
  iconFavorited: {
    color: "#04013A",
  },
});
