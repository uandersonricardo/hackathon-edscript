import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

import { useBetSlip } from "@/contexts/BetSlipContext";

export interface SuperOddsCondition {
  label: string;
}

export interface SuperOddsPanelProps {
  championship: string;
  homeTeam: { name: string; imageUrl: ImageSourcePropType };
  awayTeam: { name: string; imageUrl: ImageSourcePropType };
  conditions: SuperOddsCondition[];
  odd: number;
}

export function SuperOddsPanel({ championship, homeTeam, awayTeam, conditions, odd }: SuperOddsPanelProps) {
  const { toggle, isSelected } = useBetSlip();
  const selId = `${homeTeam.name}-${awayTeam.name}-super`;
  const selected = isSelected(selId);
  return (
    <LinearGradient
      colors={["#568469", "rgba(50,70,90, 0.5)"]}
      start={{ x: 0.7, y: 0.8 }}
      end={{ x: 0.77, y: 0 }}
      style={styles.card}
    >
      <View style={styles.circleGradient}>
        <LinearGradient
          colors={["rgba(50,70,90, 0)", "rgba(28, 53, 79, 1)"]}
          start={{ x: 0.7, y: 0.8 }}
          end={{ x: 0.77, y: 0 }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text style={styles.championship}>{championship}</Text>

      <View style={styles.teamsRow}>
        <View style={styles.team}>
          <Image source={homeTeam.imageUrl} style={styles.teamLogo} />
          <Text style={styles.teamName} numberOfLines={1}>
            {homeTeam.name}
          </Text>
        </View>

        <Text style={styles.vs}>vs</Text>

        <View style={[styles.team, styles.teamRight]}>
          <Text style={styles.teamName} numberOfLines={1}>
            {awayTeam.name}
          </Text>
          <Image source={awayTeam.imageUrl} style={styles.teamLogo} />
        </View>
      </View>

      <View style={styles.timeline}>
        {conditions.map((cond, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineDot} />
              {index < conditions.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <Text style={styles.conditionText}>{cond.label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.oddButton}
        onPress={() =>
          toggle({
            id: selId,
            homeTeam: homeTeam.name,
            awayTeam: awayTeam.name,
            leagueName: championship,
            oddLabel: `${homeTeam.name} vs ${awayTeam.name}`,
            oddValue: odd,
          })
        }
      >
        <LinearGradient
          colors={
            selected ? [Colors.dark.primary, "rgba(58,231,126,0.8)"] : ["rgba(7,4,46,0.60)", "rgba(58,231,126,0.30)"]
          }
          start={{ x: 0.12, y: 0 }}
          end={{ x: 0.11, y: 1.5 }}
          style={styles.oddGradient}
        >
          <Text style={[styles.oddValue, selected && styles.oddValueSelected]}>{odd.toFixed(2)}</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: Colors.dark.primaryMuted,
    borderColor: Colors.dark.primaryLight,
    overflow: "hidden",
    padding: 14,
    gap: 14,
    position: "relative",
  },
  championship: {
    color: Colors.dark.primaryLight,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    alignSelf: "center",
    marginTop: 20,
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  team: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  teamRight: {},
  teamLogo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  teamName: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
  vs: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  timeline: {
    gap: 0,
    paddingLeft: 2,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 8,
  },
  timelineLeft: {
    alignItems: "center",
    width: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    marginTop: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: Colors.dark.primary,
    marginVertical: 2,
    minHeight: 10,
  },
  conditionText: {
    color: Colors.dark.text,
    fontSize: 13,
    flex: 1,
    paddingBottom: 10,
    opacity: 0.9,
  },
  oddButton: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 0.75,
    borderColor: Colors.dark.primary,
  },
  oddGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  oddLabel: {
    color: Colors.dark.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
  oddValue: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "700",
  },
  oddValueSelected: {
    color: Colors.dark.background,
  },
  circleGradient: {
    position: "absolute",
    top: 15,
    left: -140,
    right: -70,
    bottom: 0,
    borderTopRightRadius: "50%",
    borderTopLeftRadius: "40%",
    overflow: "hidden",
  },
});
