import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { TopWinPanel } from "@/components/home/TopWinPanel";
import { MatchPanel } from "@/components/home/MatchPanel";
import { TopGamePanel } from "@/components/home/TopGamePanel";
import { useSearch } from "@/contexts/SearchContext";

const dailyPrize = require("../../assets/elements/premio_diario.png");

export function HomeScreen() {
  const { setActiveCategory } = useSearch();

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
        <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveCategory("Esportes")}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <MatchPanel />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Jogos que mais renderam hoje</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveCategory("Cassino")}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
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
    fontWeight: "600",
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
