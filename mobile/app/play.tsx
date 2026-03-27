import { GAME_URL } from "@/constants/games";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

export default function PlayScreen() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url ?? GAME_URL }} style={styles.webview} />
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <ChevronLeft size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 999,
    padding: 6,
  },
});
