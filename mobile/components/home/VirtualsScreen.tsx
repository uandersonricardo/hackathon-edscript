import { ChevronDown, ChevronLeft, ChevronUp, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { VirtualButton } from "@/components/home/VirtualButton";

const gameIcon = require("../../assets/elements/game_example.png");

const INSTANTANEOS = [
  { id: 1, label: "Fortuna Rabbit" },
  { id: 2, label: "Sugar Rush" },
  { id: 3, label: "Big Bass" },
  { id: 4, label: "Gates of Olympus" },
  { id: 5, label: "Sweet Bonanza" },
  { id: 6, label: "Book of Dead" },
];

const GOLDEN_RACE = [
  { id: 1, label: "Wolf Gold" },
  { id: 2, label: "Fire Joker" },
  { id: 3, label: "Razor Shark" },
  { id: 4, label: "Reactoonz" },
  { id: 5, label: "Starburst" },
  { id: 6, label: "Gonzo's Quest" },
];

interface GroupProps {
  title: string;
  items: { id: number; label: string }[];
}

function GameGroup({ title, items }: GroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.group}>
      <TouchableOpacity style={styles.groupHeader} onPress={() => setExpanded((v) => !v)} activeOpacity={0.75}>
        <Text style={styles.groupTitle}>{title}</Text>
        {expanded ? (
          <ChevronUp size={18} color={Colors.dark.textMuted} />
        ) : (
          <ChevronDown size={18} color={Colors.dark.textMuted} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <VirtualButton label={item.label} icon={gameIcon} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function VirtualsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.75}>
          <ChevronLeft size={22} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtuais</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.75}>
          <SlidersHorizontal size={16} color={Colors.dark.text} />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      <GameGroup title="Instantâneos" items={INSTANTANEOS} />
      <GameGroup title="Golden Race" items={GOLDEN_RACE} />

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
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
  group: {
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  groupTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  gridItem: {
    width: "33.33%",
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
});
