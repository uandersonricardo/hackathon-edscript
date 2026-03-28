import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import TopWinLeftShape from "@/svgs/TopWinLeftShape";
import TopWinRightShape from "@/svgs/TopWinRightShape";

const AVATAR_URI = require("../../assets/avatars/1.png");

export function TopWinPanel() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.85} onPress={() => router.push("/ranking")}>
      <TopWinLeftShape style={styles.leftShape} />
      <TopWinRightShape style={styles.rightShape} />
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
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
    marginBottom: -16,
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  leftShape: {
    zIndex: 1,
    width: "27.5%",
    height: 140,
    marginLeft: -8,
    marginBottom: 6,
  },
  rightShape: {
    marginLeft: -28,
    width: "76%",
    height: 140,
    flexShrink: 1,
  },
  content: {
    position: "absolute",
    left: "27.5%",
    height: "100%",
    alignItems: "center",
    gap: 16,
    marginLeft: 8,
    flexDirection: "row",
  },
  title: {
    color: Colors.dark.secondary,
    fontWeight: 500,
    fontSize: 15,
  },
  subtitle: {
    color: Colors.dark.text,
    fontSize: 13,
  },
  amount: {
    color: Colors.dark.secondary,
    fontWeight: 500,
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
