import { X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Category } from "@/requests/casino";

interface Props {
  visible: boolean;
  categories: Category[];
  activeCategoryId: number | undefined;
  onApply: (categoryId: number | undefined) => void;
  onClose: () => void;
}

export function GamesFilterModal({ visible, categories, activeCategoryId, onApply, onClose }: Props) {
  const [selected, setSelected] = useState<number | undefined>(activeCategoryId);

  const handleOpen = () => setSelected(activeCategoryId);

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <X size={20} color={Colors.dark.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Categorias</Text>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setSelected(undefined)}
            activeOpacity={0.75}
          >
            <View style={[styles.radio, selected === undefined && styles.radioActive]}>
              {selected === undefined && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.rowLabel}>Todos os jogos</Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.row}
              onPress={() => setSelected(cat.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.radio, selected === cat.id && styles.radioActive]}>
                {selected === cat.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.rowLabel}>{cat.name}</Text>
              <Text style={styles.rowCount}>{cat.mobileCount}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 8 }} />
        </ScrollView>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: Colors.dark.inputBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: "75%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionLabel: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.dark.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: Colors.dark.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.primary,
  },
  rowLabel: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "500",
  },
  rowCount: {
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  applyButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyText: {
    color: "#04013A",
    fontSize: 16,
    fontWeight: "700",
  },
});
