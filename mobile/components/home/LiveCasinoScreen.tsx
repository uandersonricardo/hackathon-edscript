import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { TopWinPanel } from "@/components/home/TopWinPanel";

export function LiveCasinoScreen() {
  return (
    <ScrollView style={styles.container}>
      <TopWinPanel />
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Cassino ao vivo</Text>
        <Text style={styles.placeholderSub}>Em breve</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  placeholderText: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "600",
  },
  placeholderSub: {
    color: Colors.dark.textMuted,
    fontSize: 15,
  },
});
