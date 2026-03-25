import { Bell, Plus, Search } from "lucide-react-native";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../constants/theme";

const LOGO = require("../assets/images/logo-reduced-green.png");

export function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.notifButton} activeOpacity={0.7}>
            <Bell size={20} color={Colors.dark.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.balanceButton} activeOpacity={0.7}>
            <View style={styles.depositIcon}>
              <Plus size={12} color={Colors.dark.background} strokeWidth={3} />
            </View>
            <Text style={styles.balanceText}>$100.00</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.dark.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise aqui"
          placeholderTextColor={Colors.dark.textMuted}
          selectionColor={Colors.dark.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    height: 28,
    width: 34,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  notifButton: {
    padding: 6,
  },
  balanceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 999,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 14,
    gap: 8,
  },
  depositIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
    paddingVertical: 0,
  },
});
