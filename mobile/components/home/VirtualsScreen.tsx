import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronUp, SlidersHorizontal } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { VirtualButton } from "@/components/home/VirtualButton";
import { GamesFilterModal } from "@/components/home/GamesFilterModal";
import { getVirtualCategories, getVirtualGames, type Category, type VirtualGame } from "@/requests/casino";
import { getVirtualBackground, getVirtualImage } from "@/utils/virtualImages";

interface GroupProps {
  title: string;
  items: VirtualGame[];
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
            <View key={item.iframeProviderGameId} style={styles.gridItem}>
              <VirtualButton
                label={item.name}
                icon={getVirtualImage(item.icon)}
                background={getVirtualBackground(item.icon)}
                instant={item.instant}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function VirtualsScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["virtual-categories"],
    queryFn: getVirtualCategories,
  });

  const { data: gamesPage, isFetching } = useQuery({
    queryKey: ["virtual-games", activeCategoryId],
    queryFn: () => getVirtualGames(1, 100, activeCategoryId),
  });

  const allGames = gamesPage?.games ?? [];

  const instantGames = allGames.filter((g) => g.instant);
  const groups = [
    ...(instantGames.length > 0 ? [{ category: { id: -1, name: "Instantâneos" }, items: instantGames }] : []),
    ...(categories as Category[])
      .map((cat) => ({
        category: cat,
        items: allGames.filter((g) => String(g.categoryId) === String(cat.id)),
      }))
      .filter((g) => g.items.length > 0),
  ];

  const activeCategory = (categories as Category[]).find((c) => c.id === activeCategoryId);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.75}>
            <ChevronLeft size={22} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Virtuais</Text>
          <TouchableOpacity
            style={[styles.filterButton, activeCategoryId != null && styles.filterButtonActive]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.75}
          >
            <SlidersHorizontal size={16} color={activeCategoryId != null ? "#04013A" : Colors.dark.text} />
            <Text style={[styles.filterText, activeCategoryId != null && styles.filterTextActive]}>
              {activeCategory?.name ?? "Filtros"}
              {activeCategoryId != null ? " · 1" : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {isFetching ? (
          <ActivityIndicator color={Colors.dark.primary} style={styles.centerLoader} />
        ) : (
          groups.map(({ category, items }) => <GameGroup key={category.id} title={category.name} items={items} />)
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      <GamesFilterModal
        visible={modalVisible}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onApply={setActiveCategoryId}
        onClose={() => setModalVisible(false)}
      />
    </View>
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
  filterButtonActive: {
    backgroundColor: Colors.dark.primary,
  },
  filterText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#04013A",
    fontWeight: "600",
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
    fontSize: 18,
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
  centerLoader: {
    marginTop: 40,
  },
});
