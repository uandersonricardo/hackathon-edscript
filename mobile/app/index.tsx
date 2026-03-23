import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getCasinoCategories, type Category } from "../requests/casino";
import { Canvas } from "@react-three/fiber/native";

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.wheelBanner} onPress={() => router.push("/wheel")} activeOpacity={0.85}>
        <Text style={styles.wheelBannerText}>🎡 Roda da Sorte</Text>
        <Text style={styles.wheelBannerSub}>Gire e ganhe prêmios!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameBanner} onPress={() => router.push("/game")} activeOpacity={0.85}>
        <Text style={styles.gameBannerText}>🏃 Runner</Text>
        <Text style={styles.gameBannerSub}>Swipe to dodge obstacles!</Text>
      </TouchableOpacity>
      <Canvas
        camera={{ position: [0, 3.5, 7], fov: 65 }}
        style={{ width: "100%", height: 300, flex: 1 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f0f");
        }}
      >
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />
      </Canvas>
      <Text style={styles.header}>Casino Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push({ pathname: "/modal", params: { categoryId: item.id, categoryName: item.name } })
            }
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCount}>{item.mobileCount} games</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  },
  itemCount: {
    fontSize: 13,
    color: "#888",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd",
    marginHorizontal: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  wheelBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#050a2e",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  wheelBannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 1,
  },
  wheelBannerSub: {
    fontSize: 13,
    color: "#aab4c8",
    marginTop: 4,
  },
  gameBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#0a0a1e",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00eeff44",
  },
  gameBannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00eeff",
    letterSpacing: 1,
  },
  gameBannerSub: {
    fontSize: 13,
    color: "#aab4c8",
    marginTop: 4,
  },
});
