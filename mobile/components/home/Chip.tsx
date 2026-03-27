import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/theme";

interface ChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onPress: () => void;
}

export function Chip({ label, emoji, active, onPress }: ChipProps) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      {emoji && <Text style={styles.chipEmoji}>{emoji}</Text>}
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.dark.inputBackground,
    backgroundColor: Colors.dark.inputBackground,
  },
  chipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primaryMuted,
  },
  chipEmoji: { fontSize: 13 },
  chipLabel: { color: Colors.dark.textMuted, fontSize: 12, fontWeight: "500" },
  chipLabelActive: { color: Colors.dark.primary, fontWeight: "700" },
});
