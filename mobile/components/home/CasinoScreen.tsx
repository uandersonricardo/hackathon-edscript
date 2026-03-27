import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react-native";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { TopWinPanel } from "@/components/home/TopWinPanel";
import { CasinoButton } from "@/components/home/CasinoButton";
import { GamesFilterModal } from "@/components/home/GamesFilterModal";
import { getCasinoCategories, getCasinoGames, type Category } from "@/requests/casino";
import { getCasinoImage } from "@/utils/images";

const PAGE_SIZE = 21;
const WRONG_IMAGE_IDS = [
  56, 1, 188, 151, 37, 70, 27, 45, 166, 149, 187, 51, 36, 113, 69, 35, 156, 165, 94, 148, 159, 161, 162,
];

export function CasinoScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["casino-categories"],
    queryFn: getCasinoCategories,
  });

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["casino-games", activeCategoryId],
    queryFn: ({ pageParam }) => getCasinoGames(pageParam, PAGE_SIZE, activeCategoryId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const fetched = lastPage.page * lastPage.limit;
      return fetched < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });

  const games = data?.pages.flatMap((p) => p.games) ?? [];
  const activeCategory = (categories as Category[]).find((c) => c.id === activeCategoryId);

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <TopWinPanel />

            <View style={styles.filterRow}>
              <Text style={styles.filterTitle}>{activeCategory?.name ?? "Todos os jogos"}</Text>
              <TouchableOpacity
                style={[styles.filterButton, activeCategoryId != null && styles.filterButtonActive]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.75}
              >
                <SlidersHorizontal size={16} color={activeCategoryId != null ? "#04013A" : Colors.dark.text} />
                <Text style={[styles.filterText, activeCategoryId != null && styles.filterTextActive]}>
                  Filtros{activeCategoryId != null ? " · 1" : ""}
                </Text>
              </TouchableOpacity>
            </View>

            {isFetching && !isFetchingNextPage && (
              <ActivityIndicator color={Colors.dark.primary} style={styles.centerLoader} />
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <CasinoButton
              label={item.name}
              icon={{ uri: getCasinoImage(WRONG_IMAGE_IDS.includes(item.vendorId) ? item.id - 1 : item.id) }}
              vendorName={item.vendorName}
              popular={item.popular}
              newGame={item.newGame}
            />
          </View>
        )}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={Colors.dark.primary} style={styles.footerLoader} />
          ) : (
            <View style={{ height: 16 }} />
          )
        }
      />

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
  content: {
    paddingBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 4,
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
  row: {
    paddingHorizontal: 12,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  centerLoader: {
    marginTop: 40,
    marginBottom: 20,
  },
  footerLoader: {
    marginVertical: 16,
  },
});
