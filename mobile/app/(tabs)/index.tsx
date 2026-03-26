import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getCasinoCategories, type Category } from "../../requests/casino";
import { Colors } from "@/constants/theme";
import { BannerCarousel } from "@/components/BannerCarousel";
import { TopWinPanel } from "@/components/TopWinPanel";
import { MatchPanel } from "@/components/MatchPanel";
import { TopGamePanel } from "@/components/TopGamePanel";

const dailyPrize = require("../../assets/elements/premio_diario.png");

export default function Index() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCasinoCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.carouselFixedOuter}>
          <Link href="/wheel" asChild>
            <TouchableOpacity style={styles.carouselFixedInner} activeOpacity={0.85}>
              <Image source={dailyPrize} style={styles.carouselImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </View>
        <BannerCarousel />
      </View>

      <TopWinPanel />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Partidas rolando agora</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
      <MatchPanel />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Jogos que mais renderam hoje</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesProfitContainer}>
        <TopGamePanel />
        <TopGamePanel />
        <TopGamePanel />
      </ScrollView>

      <View style={{ width: 1, height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
  },
  carouselContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  carouselFixedOuter: {
    shadowColor: Colors.dark.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
    shadowOpacity: 1,
  },
  carouselFixedInner: {
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.dark.tertiaryStroke,
    backgroundColor: Colors.dark.background,
    overflow: "hidden",
  },
  carouselImage: {
    height: 110,
    width: 130,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemName: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  itemCount: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.dark.textMuted,
    marginHorizontal: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 600,
  },
  seeAll: {
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  gamesProfitContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
});
