import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ChartColumnIcon, SquareStarIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TeamInfo {
  name: string;
  imageUrl: ImageSourcePropType;
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

interface FutureMatchPanelProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  odds: MatchOdds;
  date?: string;
  live?: boolean;
  startSecond?: number;
  more?: number;
}

function randomDelta(base: number): number {
  const delta = (Math.random() - 0.5) * 0.1 * base;
  return Math.round((base + delta) * 100) / 100;
}

export function FutureMatchPanel({
  homeTeam,
  awayTeam,
  odds,
  date,
  live = false,
  startSecond = 0,
  more = Math.floor(Math.random() * 1000),
}: FutureMatchPanelProps) {
  const [second, setSecond] = useState(startSecond);
  const [currentOdds, setCurrentOdds] = useState<MatchOdds>(odds);
  const secondRef = useRef(startSecond);

  useEffect(() => {
    if (!live) return;

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
  }, [live]);

  const timeLabel = live
    ? `${String(Math.floor(second / 60)).padStart(2, "0")}:${String(second % 60).padStart(2, "0")}`
    : (date ?? "");

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.30)"]}
        start={{ x: 0.45, y: 0 }}
        end={{ x: 0.4, y: 0.9 }}
        style={styles.gradient}
      >
        <View style={styles.topContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{timeLabel}</Text>
            <Text style={styles.bbText}>BB</Text>
          </View>
          <View style={styles.timeContainer}>
            {false && live && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>AO VIVO</Text>
              </View>
            )}
            <Text style={styles.moreText}>+{more}</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.oddsContainer}>
            <View style={styles.oddContainer}>
              <View style={styles.teamContainer}>
                <Image source={homeTeam.imageUrl} style={styles.teamImage} />
                <Text style={styles.teamText}>{homeTeam.name}</Text>
              </View>
              <Pressable style={styles.outerButton}>
                <LinearGradient
                  colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textButton}>{currentOdds.home.toFixed(2)}</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={styles.separator} />
            <View style={styles.oddContainer}>
              <View style={styles.teamContainer}>
                <Text style={styles.teamText}>Empate</Text>
              </View>
              <Pressable style={styles.outerButton}>
                <LinearGradient
                  colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textButton}>{currentOdds.draw.toFixed(2)}</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={styles.separator} />
            <View style={styles.oddContainer}>
              <View style={styles.teamContainer}>
                <Image source={awayTeam.imageUrl} style={styles.teamImage} />
                <Text style={styles.teamText}>{awayTeam.name}</Text>
              </View>
              <Pressable style={styles.outerButton}>
                <LinearGradient
                  colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textButton}>{currentOdds.away.toFixed(2)}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statsButton}>
              <ChartColumnIcon color={Colors.dark.text} size={15} />
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    overflow: "hidden",
    gap: 8,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gradient: {
    width: "100%",
    padding: 10,
    gap: 16,
  },
  outerButton: {
    width: "100%",
  },
  gradientButton: {
    paddingVertical: 4,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0.75,
    borderColor: Colors.dark.primary,
    overflow: "hidden",
  },
  timeText: {
    color: Colors.dark.text,
    fontSize: 13,
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
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(231,58,58,0.20)",
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 0.75,
    borderColor: "#E73A3A",
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E73A3A",
  },
  liveText: {
    color: "#E73A3A",
    fontSize: 10,
    fontWeight: "700",
  },
  moreText: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.primaryMuted,
    borderRadius: 4,
    fontSize: 11,
    paddingVertical: 1,
    paddingHorizontal: 4,
    fontWeight: "500",
  },
  textButton: {
    color: Colors.dark.text,
  },
  bottomContainer: {
    flexDirection: "row",
    gap: 8,
  },
  oddsContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  statsContainer: {
    justifyContent: "flex-end",
  },
  statsButton: {
    backgroundColor: Colors.dark.primaryMuted,
    padding: 6,
    borderRadius: 8,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  teamImage: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
  teamText: {
    color: Colors.dark.text,
    fontSize: 11,
  },
  oddContainer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: "100%",
    width: 1.5,
    backgroundColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
    shadowOpacity: 1,
  },
});
