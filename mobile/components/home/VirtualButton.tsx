import { Colors } from "@/constants/theme";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { GameModal } from "@/components/common/GameModal";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  type ImageSourcePropType,
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";

const CARD_BG = require("../../assets/elements/card_background.png");

interface Props {
  label: string;
  icon: ImageSourcePropType;
  background: ImageSourcePropType | string;
  instant?: boolean;
}

export function VirtualButton({ label, icon, background, instant }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const inner = (
    <>
      <LinearGradient
        colors={["#07042E", "rgba(23, 13, 148, 0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.leftGradient}
      />
      <View style={styles.starColumn}>
        {instant ? (
          <View style={styles.instantBadge}>
            <Text style={styles.instantText}>INSTANTÂNEO</Text>
          </View>
        ) : (
          <View />
        )}
        <FavoriteButton />
      </View>
      <View style={styles.infoContainer}>
        <Image source={CARD_BG} style={styles.cardBackground} resizeMode="contain" />
      </View>
      <View style={styles.titleContainer}>
        <Image source={icon} style={styles.characterImage} resizeMode="contain" />
        <Text style={styles.gameTitle}>{label}</Text>
      </View>
    </>
  );

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        {typeof background === "string" ? (
          <View style={[styles.backgroundImage, { backgroundColor: background }]}>{inner}</View>
        ) : (
          <ImageBackground source={background} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
            {inner}
          </ImageBackground>
        )}
      </TouchableOpacity>

      <GameModal visible={modalVisible} onClose={() => setModalVisible(false)} label={label} icon={icon} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 139,
    position: "relative",
    boxShadow: `1px 1px 1px ${Colors.dark.primary}`,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark.tertiaryStroke,
    borderRadius: 20,
  },
  backgroundImage: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
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
  instantBadge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  instantText: {
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
    marginTop: 4,
  },
  cardBackground: {
    width: "70%",
    height: "70%",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
