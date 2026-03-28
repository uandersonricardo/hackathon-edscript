import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";

const AVATAR_URI = require("../../assets/avatars/1.png");
const TOP_WIN_BG = require("../../assets/elements/top_win.png");

export function TopWinPanel() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.85} onPress={() => router.push("/ranking")}>
      <Image source={TOP_WIN_BG} style={styles.bg} resizeMode="contain" />
      <View style={styles.content}>
        <Image source={AVATAR_URI} style={styles.avatar} />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Ulisses ****</Text>
          <Text style={styles.subtitle}>Fortuna Rabbit</Text>
          <Text style={styles.amount}>R$ 20.278,37</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 11,
    marginBottom: -16,
    position: "relative",
  },
  bg: {
    width: "100%",
    height: 140,
  },
  content: {
    position: "absolute",
    left: "27.5%",
    top: 0,
    bottom: 0,
    alignItems: "center",
    gap: 16,
    marginLeft: 8,
    flexDirection: "row",
  },
  title: {
    color: Colors.dark.secondary,
    fontWeight: "500",
    fontSize: 15,
  },
  subtitle: {
    color: Colors.dark.text,
    fontSize: 13,
  },
  amount: {
    color: Colors.dark.secondary,
    fontWeight: "500",
    fontSize: 15,
  },
  contentWrapper: {
    gap: 2,
  },
  avatar: {
    height: 60,
    width: 60,
  },
});
