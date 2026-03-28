import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import TopGameShape from "@/svgs/TopGameShape";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { GameModal } from "../common/GameModal";

interface Props {
  position: number;
  name: string;
  winAmount: number;
  imageUrl: ImageSourcePropType;
  vendorName: string;
}

export function TopGamePanel({ position, name, winAmount, imageUrl, vendorName }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const formatted = winAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <TopGameShape style={styles.gameShape} />
        <Text style={styles.positionText}>{position}º</Text>
        <Text style={styles.amountText}>{formatted}</Text>
        <View style={styles.content}>
          <Image source={imageUrl} style={styles.avatar} />
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <GameModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        label={name}
        icon={imageUrl}
        vendorName={vendorName}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 163,
    height: 99,
    position: "relative",
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  positionText: {
    position: "absolute",
    left: 13,
    top: 5,
    zIndex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  amountText: {
    position: "absolute",
    left: 44,
    top: 17,
    zIndex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  gameShape: {
    zIndex: 1,
    width: 163,
    height: 99,
  },
  content: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    gap: 8,
    marginLeft: 8,
    flexDirection: "row",
    zIndex: 1,
    alignItems: "center",
    paddingTop: 28,
  },
  title: {
    color: Colors.dark.text,
    fontWeight: 700,
    fontSize: 13,
    flexWrap: "wrap",
    width: 70,
  },
  contentWrapper: {
    gap: 2,
    justifyContent: "center",
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    aspectRatio: 1,
  },
});
