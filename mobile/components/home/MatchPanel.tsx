import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ChartColumnIcon, SquareStarIcon } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AVATAR_URI = require("../../assets/avatars/1.png");

export function MatchPanel() {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.30)"]}
        start={{ x: 0.45, y: 0 }} // 216deg approximation
        end={{ x: 0.4, y: 0.9 }}
        style={styles.gradient}
      >
        <View style={styles.topContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>Hoje, 18:30</Text>
            <Text style={styles.bbText}>BB</Text>
          </View>
          <Text style={styles.moreText}>+1057</Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.oddsContainer}>
            <View style={styles.oddContainer}>
              <View style={styles.teamContainer}>
                <SquareStarIcon size={11} color={Colors.dark.text} />
                <Text style={styles.teamText}>Auckland FC</Text>
              </View>
              <Pressable style={styles.outerButton}>
                <LinearGradient
                  colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textButton}>1.81</Text>
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
                  <Text style={styles.textButton}>3.56</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={styles.separator} />
            <View style={styles.oddContainer}>
              <View style={styles.teamContainer}>
                <SquareStarIcon size={11} color={Colors.dark.text} />
                <Text style={styles.teamText}>Macarthur FC</Text>
              </View>
              <Pressable style={styles.outerButton}>
                <LinearGradient
                  colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textButton}>4.86</Text>
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
    fontWeight: 500,
  },
  moreText: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.primaryMuted,
    borderRadius: 4,
    fontSize: 11,
    paddingVertical: 1,
    paddingHorizontal: 4,
    fontWeight: 500,
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
