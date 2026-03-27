import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { Colors } from "../../constants/theme";

const PRIZES = [
  { label: "Roleta da Sorte", image: require("../../assets/prizes/roleta.png") },
  { label: "Drible da Sorte", image: require("../../assets/prizes/drible.png") },
  { label: "Torneios", image: require("../../assets/prizes/torneio.png") },
  { label: "Missões", image: require("../../assets/prizes/missoes.png") },
  { label: "Baús", image: require("../../assets/prizes/baus.png") },
  { label: "Ranking Semanal", image: require("../../assets/prizes/torneio.png") },
];

function PrizeButton({ label, image, onPress }: { label: string; image: number; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.cardWrapper} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.card}>
        <LinearGradient
          colors={["rgba(7,4,46,0.10)", "rgba(58,231,126,0.5)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={styles.gradient}
        >
          <View style={styles.cardFooter}>
            <Text style={styles.cardLabel} numberOfLines={2}>
              {label}
            </Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>JOGUE AGORA!</Text>
            </View>
          </View>
          <Image source={image} style={styles.image} resizeMode="cover" />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

export default function Prizes() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Prêmios</Text>
      <View style={styles.grid}>
        {PRIZES.map((prize) => (
          <PrizeButton
            key={prize.label}
            label={prize.label}
            image={prize.image}
            onPress={prize.label === "Ranking Semanal" ? () => router.push("/ranking") : undefined}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  cardWrapper: {
    width: "47%",
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 1,
    shadowOpacity: 1,
  },
  card: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: Colors.dark.card,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    width: "100%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  cardFooter: {
    padding: 10,
    gap: 6,
    alignItems: "flex-end",
  },
  cardLabel: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
  },
  tag: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: Colors.dark.background,
    fontSize: 10,
    fontWeight: "700",
  },
});
