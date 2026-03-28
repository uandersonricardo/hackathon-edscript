import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/theme";
import { StarIcon } from "lucide-react-native";

export function FavoriteButton() {
  const [favorited, setFavorited] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.circle, favorited && styles.circleFavorited]}
      onPress={() => setFavorited((v) => !v)}
      activeOpacity={0.75}
    >
      <StarIcon color={Colors.dark.background} fill={Colors.dark.background} size={14} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.dark.text,
    alignItems: "center",
    justifyContent: "center",
  },
  circleFavorited: {
    backgroundColor: Colors.dark.primary,
  },
  icon: {
    color: Colors.dark.card,
    fontSize: 14,
  },
  iconFavorited: {
    color: "#04013A",
  },
});
