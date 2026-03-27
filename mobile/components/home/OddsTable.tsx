import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/theme";

export interface OddsRow {
  homeTeam: { name: string; imageUrl: ImageSourcePropType };
  awayTeam: { name: string; imageUrl: ImageSourcePropType };
  date: string;
  moreCount: number;
  home: number;
  draw: number;
  away: number;
}

export function OddsTable({ rows }: { rows: OddsRow[] }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.matchCell} />
        {(["1", "x", "2"] as const).map((label) => (
          <View key={label} style={styles.oddCell}>
            <Text style={styles.headerLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, index) => (
        <View key={index} style={styles.rowCard}>
          <View style={styles.matchCell}>
            <View style={styles.teamsRow}>
              <Image source={row.homeTeam.imageUrl} style={styles.teamLogo} />
              <Text style={styles.teamName} numberOfLines={1}>
                {row.homeTeam.name}
              </Text>
            </View>
            <View style={styles.teamsRow}>
              <Image source={row.awayTeam.imageUrl} style={styles.teamLogo} />
              <Text style={styles.teamName} numberOfLines={1}>
                {row.awayTeam.name}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.dateText}>{row.date}</Text>
              <View style={styles.moreBadge}>
                <Text style={styles.moreText}>+{row.moreCount}</Text>
              </View>
            </View>
          </View>

          {[row.home, row.draw, row.away].map((odd, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.oddButton, pressed && styles.oddButtonPressed]}
            >
              <LinearGradient
                colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.oddGradient}
              >
                <Text style={styles.oddValue}>{odd.toFixed(2)}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginBottom: 16, gap: 8 },
  headerRow: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 4, gap: 4 },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: "hidden",
    gap: 4,
  },
  matchCell: { flex: 1, gap: 4, paddingRight: 8 },
  teamsRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  oddButton: { width: 52, borderRadius: 8, borderWidth: 0.75, borderColor: Colors.dark.primary, overflow: "hidden" },
  oddButtonPressed: { opacity: 0.7 },
  oddGradient: { paddingVertical: 6, alignItems: "center" },
  headerLabel: { color: Colors.dark.textMuted, fontSize: 12, fontWeight: "700", width: 52, textAlign: "center" },
  oddCell: { width: 52 },
  teamLogo: { width: 16, height: 16, resizeMode: "contain" },
  teamName: { color: Colors.dark.text, fontSize: 12, fontWeight: "500", flexShrink: 1 },
  dateText: { color: Colors.dark.textMuted, fontSize: 11 },
  moreBadge: { backgroundColor: Colors.dark.primaryMuted, borderRadius: 4, paddingVertical: 1, paddingHorizontal: 4 },
  moreText: { color: Colors.dark.text, fontSize: 10, fontWeight: "500" },
  oddValue: { color: Colors.dark.primary, fontSize: 13, fontWeight: "600" },
});
