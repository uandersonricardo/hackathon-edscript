import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TicketIcon } from "lucide-react-native";

import { Colors } from "@/constants/theme";
import { useBetSlip } from "@/contexts/BetSlipContext";

export function BetSlipButton() {
  const { count, clear } = useBetSlip();

  if (count === 0) return null;

  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={clear}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
      <TicketIcon size={24} color={Colors.dark.background} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    boxShadow: `0px 4px 10px ${Colors.dark.primary}`,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.dark.text,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  badgeText: {
    color: Colors.dark.background,
    fontSize: 11,
    fontWeight: "800",
  },
});
