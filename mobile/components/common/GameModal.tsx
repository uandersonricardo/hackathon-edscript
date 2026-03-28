import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  type ImageSourcePropType,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { X } from "lucide-react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  label: string;
  icon: ImageSourcePropType;
  vendorName?: string | null;
}

export function GameModal({ visible, onClose, label, icon, vendorName }: Props) {
  const router = useRouter();

  const handlePlay = () => {
    onClose();
    router.push("/play");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <X size={20} color={Colors.dark.text} />
          </TouchableOpacity>

          <View style={styles.imageWrapper}>
            <ExpoImage
              source={{ uri: "https://i.makeagif.com/media/3-27-2026/8igKus.gif" }}
              style={styles.gameImage}
              contentFit="cover"
              contentPosition="top"
            />
            <LinearGradient colors={["transparent", Colors.dark.background]} style={styles.imageGradient} />
          </View>

          <View style={styles.info}>
            <Text style={styles.gameTitle}>{label}</Text>
            <Text style={styles.providerName}>{vendorName ?? "Esportes da Sorte"}</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={handlePlay} activeOpacity={0.85}>
            <Text style={styles.playButtonText}>Jogar agora</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    minHeight: "80%",
    maxHeight: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 999,
    padding: 6,
  },
  imageWrapper: {
    width: "100%",
    flex: 1,
  },
  gameImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 4,
  },
  gameTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  providerName: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "400",
  },
  playButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  playButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
