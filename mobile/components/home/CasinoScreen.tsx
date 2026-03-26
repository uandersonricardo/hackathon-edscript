import { SlidersHorizontal } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { TopWinPanel } from "@/components/home/TopWinPanel";
import { CasinoButton } from "@/components/home/CasinoButton";

const gameIcon = require("../../assets/elements/game_example.png");

const CASINO_GAMES = [
  { id: 1, label: "Fortuna Rabbit" },
  { id: 2, label: "Sugar Rush" },
  { id: 3, label: "Big Bass" },
  { id: 4, label: "Gates of Olympus" },
  { id: 5, label: "Sweet Bonanza" },
  { id: 6, label: "Book of Dead" },
  { id: 7, label: "Starburst" },
  { id: 8, label: "Gonzo's Quest" },
  { id: 9, label: "Wolf Gold" },
  { id: 10, label: "Fire Joker" },
  { id: 11, label: "Razor Shark" },
  { id: 12, label: "Reactoonz" },
];

export function CasinoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TopWinPanel />

      <View style={styles.filterRow}>
        <Text style={styles.filterTitle}>Todos os jogos</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.75}>
          <SlidersHorizontal size={16} color={Colors.dark.text} />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {CASINO_GAMES.map((game) => (
          <View key={game.id} style={styles.gridItem}>
            <CasinoButton label={game.label} icon={gameIcon} />
          </View>
        ))}
      </View>

      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {},
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filterText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  gridItem: {
    width: "33.33%",
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
});
