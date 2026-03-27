import { Colors } from "@/constants/theme";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { LinearGradient } from "expo-linear-gradient";
import { type ImageSourcePropType, StyleSheet, View, Image, ImageBackground, Text } from "react-native";

interface Props {
  label: string;
  icon: ImageSourcePropType;
  vendorName?: string | null;
  popular?: boolean;
  newGame?: boolean;
}

export function CasinoButton({ label, icon, vendorName, popular, newGame }: Props) {
  return (
    <View style={styles.card}>
      <View style={{ width: "100%", height: "100%" }}>
        <LinearGradient
          colors={["#07042E", "rgba(23, 13, 148, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.leftGradient}
        />

        <View style={styles.imageContainer}>
          <ImageBackground source={icon} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
            <Image source={icon} style={styles.characterImage} resizeMode="contain" />
          </ImageBackground>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.badgesContainer}>
              {newGame && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>NOVO</Text>
                </View>
              )}
              {popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              )}
            </View>
            <Text style={styles.gameTitle} numberOfLines={2}>
              {label}
            </Text>
            <Text style={styles.providerName} numberOfLines={1}>
              {vendorName ?? "Esportes da Sorte"}
            </Text>
          </View>
          <View style={styles.starColumn}>
            <FavoriteButton />
          </View>
        </View>
      </View>
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
    width: "100%",
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
    width: "100%",
    height: "100%",
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: "100%",
    backgroundColor: Colors.dark.card,
    flexDirection: "row",
    position: "relative",
  },
  starColumn: {
    zIndex: 2,
  },
  badgesContainer: {
    position: "absolute",
    bottom: "100%",
    gap: 2,
    marginBottom: 2,
    alignItems: "flex-start",
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
    height: 54,
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
});
