import { Bell, Plus, Search } from "lucide-react-native";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../contexts/SearchContext";
import { Colors } from "../constants/theme";
import { CategoryButton } from "./CategoryButton";

const LOGO = require("../assets/images/logo-reduced-green.png");

const CATEGORIES = [
  { label: "Esportes", icon: require("../assets/icons/fixtures.png") },
  { label: "Cassino", icon: require("../assets/icons/casino.png") },
  { label: "Cassino ao vivo", icon: require("../assets/icons/liveCasino.png") },
  { label: "Virtuais", icon: require("../assets/icons/virtuals.png") },
] as const;

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { isLoggedIn, login } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <View style={styles.actions}>
          {isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.notifButton} activeOpacity={0.7}>
                <Bell size={24} color={Colors.dark.text} />
                <View style={styles.notifBadge} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.balanceButton} activeOpacity={0.7}>
                <View style={styles.depositIcon}>
                  <Plus size={20} color={Colors.dark.background} strokeWidth={2.5} />
                </View>
                <Text style={styles.balanceText}>R$100,00</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={login}>
                <Text style={styles.loginText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton} activeOpacity={0.7}>
                <Text style={styles.registerText}>Criar conta</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.dark.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise aqui"
          placeholderTextColor={Colors.dark.textMuted}
          selectionColor={Colors.dark.primary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.categoriesRow}>
        {CATEGORIES.map((cat) => (
          <CategoryButton key={cat.label} label={cat.label} icon={cat.icon} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 20,
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
  notifBadge: {
    position: "absolute",
    top: 3,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 2,
    borderColor: Colors.dark.background,
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
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginRight: 4,
  },
  loginText: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  registerText: {
    color: Colors.dark.background,
    fontSize: 15,
    fontWeight: "700",
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
  categoriesRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 2,
  },
});
