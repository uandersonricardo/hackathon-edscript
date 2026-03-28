import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { PlaySquareIcon, Radio } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

import { useBetSlip } from "@/contexts/BetSlipContext";

export interface LiveTeamInfo {
  name: string;
  imageUrl: ImageSourcePropType;
  score: number;
}

export interface LiveMatchOdds {
  home: number;
  draw: number;
  away: number;
}

interface LiveMatchPanelProps {
  championshipName: string;
  homeTeam: LiveTeamInfo;
  awayTeam: LiveTeamInfo;
  odds: LiveMatchOdds;
  startSecond?: number;
  leagueName?: string;
}

function randomDelta(base: number): number {
  const delta = (Math.random() - 0.5) * 0.1 * base;
  return Math.round((base + delta) * 100) / 100;
}

export function LiveMatchPanel({ championshipName, homeTeam, awayTeam, odds, startSecond = 0, leagueName = "" }: LiveMatchPanelProps) {
  const [second, setSecond] = useState(startSecond);
  const [currentOdds, setCurrentOdds] = useState<LiveMatchOdds>(odds);
  const secondRef = useRef(startSecond);
  const { toggle, isSelected } = useBetSlip();

  const selId = (type: string) => `${homeTeam.name}-${awayTeam.name}-${type}`;

  const ODD_BUTTONS: { type: "home" | "draw" | "away"; label: string; shortLabel: string; value: number }[] = [
    { type: "home", label: homeTeam.name, shortLabel: "1", value: currentOdds.home },
    { type: "draw", label: "Empate", shortLabel: "Empate", value: currentOdds.draw },
    { type: "away", label: awayTeam.name, shortLabel: "2", value: currentOdds.away },
  ];

  useEffect(() => {
    const clockTimer = setInterval(() => {
      secondRef.current = Math.min(secondRef.current + 1, 90 * 60);
      setSecond(secondRef.current);
    }, 1000);

    const oddsTimer = setInterval(
      () => {
        setCurrentOdds((prev) => ({
          home: randomDelta(prev.home),
          draw: randomDelta(prev.draw),
          away: randomDelta(prev.away),
        }));
      },
      3000 + Math.random() * 3000,
    );

    return () => {
      clearInterval(clockTimer);
      clearInterval(oddsTimer);
    };
  }, []);

  const timeLabel = `${String(Math.floor(second / 60)).padStart(2, "0")}:${String(second % 60).padStart(2, "0")}`;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.30)"]}
        start={{ x: 0.45, y: 0 }}
        end={{ x: 0.4, y: 0.9 }}
        style={styles.gradient}
      >
        <View style={styles.headerRow}>
          <Text style={styles.championshipText} numberOfLines={1}>
            {championshipName}
          </Text>
          <View style={styles.headerRight}>
            <Text style={styles.bbText}>A</Text>
            <Text style={styles.timeText}>{timeLabel}</Text>
            <PlaySquareIcon color={Colors.dark.text} size={18} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Image source={homeTeam.imageUrl} style={styles.teamImage} />
            <Text style={styles.teamText}>{homeTeam.name}</Text>
          </View>
          <Text style={styles.scoreText}>{homeTeam.score}</Text>
        </View>

        <View style={styles.scoreDividerRow}>
          <View style={styles.scoreLine} />
          <Text style={styles.scoreDividerText}>×</Text>
          <View style={styles.scoreLine} />
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Image source={awayTeam.imageUrl} style={styles.teamImage} />
            <Text style={styles.teamText}>{awayTeam.name}</Text>
          </View>
          <Text style={styles.scoreText}>{awayTeam.score}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.resultadoLabel}>Resultado</Text>

        <View style={styles.oddsRow}>
          {ODD_BUTTONS.map((btn) => {
            const selected = isSelected(selId(btn.type));
            return (
              <Pressable key={btn.type} style={styles.outerButton} onPress={() => toggle({ id: selId(btn.type), homeTeam: homeTeam.name, awayTeam: awayTeam.name, leagueName, oddLabel: btn.label, oddValue: btn.value })}>
                <LinearGradient
                  colors={selected ? [Colors.dark.primary, "rgba(58,231,126,0.8)"] : ["rgba(7,4,46,0.80)", "rgba(58,231,126,0.50)"]}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0.05, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={[styles.oddValue, selected && styles.oddValueSelected]}>{btn.value.toFixed(2)}</Text>
                  <View style={styles.oddSeparator} />
                  <Text style={[styles.oddLabel, selected && styles.oddLabelSelected]}>{btn.shortLabel}</Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    overflow: "hidden",
    width: 300,
  },
  gradient: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  championshipText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bbText: {
    color: Colors.dark.background,
    backgroundColor: Colors.dark.text,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    fontSize: 11,
    paddingVertical: 1,
    paddingHorizontal: 4,
    fontWeight: "500",
  },
  timeText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "600",
    width: 40,
    marginRight: -4,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.dark.primary,
    opacity: 1,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  teamImage: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  teamText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "500",
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.dark.background,
    backgroundColor: Colors.dark.text,
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  scoreDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -8,
    marginBottom: -8,
  },
  scoreLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.dark.primary,
    opacity: 1,
  },
  scoreDividerText: {
    color: Colors.dark.text,
    fontSize: 13,
    opacity: 1,
    letterSpacing: 1,
  },
  resultadoLabel: {
    color: Colors.dark.text,
    fontSize: 13,
    opacity: 1,
    fontWeight: "500",
    margin: 8,
    marginBottom: 0,
  },
  oddsRow: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  outerButton: {
    flex: 1,
  },
  gradientButton: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    overflow: "hidden",
    gap: 2,
  },
  oddLabel: {
    color: Colors.dark.text,
    fontSize: 11,
    opacity: 1,
    marginVertical: 4,
  },
  oddLabelSelected: {
    color: Colors.dark.background,
    fontWeight: "700",
  },
  oddValue: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 4,
  },
  oddValueSelected: {
    color: Colors.dark.background,
  },
  oddSeparator: {
    width: "100%",
    height: 1.5,
    backgroundColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
    shadowOpacity: 1,
  },
});
