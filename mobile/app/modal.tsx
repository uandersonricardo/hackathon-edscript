import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getCasinoGames, type Game } from "../requests/casino";

export default function ModalScreen() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCasinoGames()
      .then((all) => setGames(all.filter((g) => g.categoryId === Number(categoryId))))
      .catch(() => setError("Failed to load games"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{categoryName}</Text>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={games}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.gameName}>{item.name}</Text>
              <View style={styles.badges}>
                {item.popular && <Text style={styles.badge}>Popular</Text>}
                {item.newGame && <Text style={[styles.badge, styles.badgeNew]}>New</Text>}
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.empty}>No games found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameName: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    fontSize: 11,
    color: "#fff",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  badgeNew: {
    backgroundColor: "#10b981",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd",
    marginHorizontal: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
