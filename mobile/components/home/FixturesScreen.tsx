import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { MatchPanel } from "./MatchPanel";

const gameIcon = require("../../assets/elements/game_example.png");

export function FixturesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Partidas rolando agora</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
      <MatchPanel
        homeTeam={{ name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") }}
        awayTeam={{ name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") }}
        odds={{ home: 1.81, draw: 3.56, away: 4.86 }}
        live
        startSecond={34 * 60 + 13}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Super odds</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Jogos que mais renderam hoje</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
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
});
