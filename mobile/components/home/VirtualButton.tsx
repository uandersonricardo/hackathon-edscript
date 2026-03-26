import { Colors } from "@/constants/theme";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View, ImageBackground, Text } from "react-native";
import CardBackgroundShape from "@/svgs/CardBackgroundShape";

interface Props {
  label: string;
  icon: number;
}

export function VirtualButton({ label, icon }: Props) {
  return (
    <View style={styles.card}>
      {/* Left-side gradient — sits at the top of the flex column */}
      <ImageBackground
        source={require("../../assets/elements/game_example.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={["#07042E", "rgba(23, 13, 148, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.leftGradient}
        />
        <View style={styles.starColumn}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>POPULAR</Text>
          </View>
          <FavoriteButton />
        </View>
        <View style={styles.infoContainer}>
          <CardBackgroundShape style={styles.cardBackground} />
        </View>
        <View style={styles.titleContainer}>
          <Image source={require("../../assets/avatars/1.png")} style={styles.characterImage} resizeMode="contain" />
          <Text style={styles.gameTitle}>{label}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 139,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    overflow: "hidden",
    position: "relative",
  },
  backgroundImage: {
    flex: 1,
    flexDirection: "column",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  leftGradient: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  characterImage: {
    width: 50,
    height: 50,
    zIndex: 2,
  },
  spacer: {
    flex: 1,
  },
  bottomGradient: {
    height: 74,
  },
  infoContainer: {
    marginTop: "auto",
    width: "100%",
    height: "90%",
    backgroundColor: Colors.dark.card,
    flexDirection: "row",
    borderTopRightRadius: "70%",
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  starColumn: {
    zIndex: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  badgesContainer: {
    position: "absolute",
    bottom: "100%",
    gap: 2,
    marginBottom: 2,
  },
  popularBadge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  popularText: {
    color: "#04013A",
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: -0.206,
  },
  titleContainer: {
    gap: 2,
    zIndex: 2,
    flex: 1,
    position: "relative",
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  gameTitle: {
    color: "#E6E6E6",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.3,
    lineHeight: 18,
    marginTop: 4,
  },
  providerName: {
    color: "#E6E6E6",
    fontSize: 10,
    fontWeight: "400",
    letterSpacing: -0.3,
  },
  cardBackground: {
    width: "70%",
    height: "70%",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
