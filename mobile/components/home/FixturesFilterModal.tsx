import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { Chip } from "./Chip";

const SPORTS = [
  { id: "futebol", emoji: "⚽", label: "Futebol" },
  { id: "efootball", emoji: "🎮", label: "eFootball" },
  { id: "basquete", emoji: "🏀", label: "Basquete" },
  { id: "tenis", emoji: "🎾", label: "Tênis" },
  { id: "tenis-mesa", emoji: "🏓", label: "Tênis de mesa" },
  { id: "volei", emoji: "🏐", label: "Vôlei" },
  { id: "handebol", emoji: "🤾", label: "Handebol" },
  { id: "beisebol", emoji: "⚾", label: "Beisebol" },
  { id: "boxe", emoji: "🥊", label: "Boxe" },
  { id: "futebol-americano", emoji: "🏈", label: "Futebol Americano" },
  { id: "futsal", emoji: "⚽", label: "Futsal" },
  { id: "hoquei-campo", emoji: "🏑", label: "Hóquei em campo" },
  { id: "hoquei-gelo", emoji: "🏒", label: "Hóquei no Gelo" },
  { id: "rugby", emoji: "🏉", label: "Rugby" },
  { id: "cs", emoji: "🎮", label: "Counter-Strike" },
  { id: "criquete", emoji: "🏏", label: "Críquete" },
  { id: "curling", emoji: "🥌", label: "Curling" },
  { id: "dardos", emoji: "🎯", label: "Dardos" },
];

const COUNTRIES = [
  { id: "ing", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "Inglaterra" },
  { id: "esp", emoji: "🇪🇸", label: "Espanha" },
  { id: "ale", emoji: "🇩🇪", label: "Alemanha" },
  { id: "ita", emoji: "🇮🇹", label: "Itália" },
  { id: "fra", emoji: "🇫🇷", label: "França" },
  { id: "bra", emoji: "🇧🇷", label: "Brasil" },
  { id: "por", emoji: "🇵🇹", label: "Portugal" },
  { id: "hol", emoji: "🇳🇱", label: "Holanda" },
  { id: "arg", emoji: "🇦🇷", label: "Argentina" },
  { id: "eua", emoji: "🇺🇸", label: "EUA" },
  { id: "jap", emoji: "🇯🇵", label: "Japão" },
  { id: "bel", emoji: "🇧🇪", label: "Bélgica" },
  { id: "tur", emoji: "🇹🇷", label: "Turquia" },
  { id: "mex", emoji: "🇲🇽", label: "México" },
];

const POPULARIDADE = [
  { id: "em-alta", label: "Em alta" },
  { id: "mais-jogados", label: "Mais jogados" },
];

const RECURSOS = [
  { id: "free-spins", label: "Free Spins" },
  { id: "bonus-buy", label: "Bonus Buy" },
  { id: "multiplayer", label: "Multiplayer" },
];

const VOLATILIDADE = [
  { id: "baixa", label: "Baixa" },
  { id: "media", label: "Média" },
  { id: "alta", label: "Alta" },
];

const RTP = [
  { id: "rtp-90", label: "90–94%" },
  { id: "rtp-95", label: "95–97%" },
  { id: "rtp-98", label: "98%+" },
];

const OUTROS = [
  { id: "lancamentos", label: "Lançamentos" },
  { id: "favoritos", label: "Favoritos" },
];

export interface FilterState {
  sport: string;
  country: string;
  popularidade: string | null;
  recursos: string[];
  volatilidade: string | null;
  rtp: string | null;
  outros: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  sport: "futebol",
  country: "ing",
  popularidade: null,
  recursos: [],
  volatilidade: null,
  rtp: null,
  outros: [],
};

export function countActiveFilters(f: FilterState) {
  let n = 0;
  if (f.sport !== "futebol") n++;
  if (f.country !== "ing") n++;
  if (f.popularidade) n++;
  n += f.recursos.length;
  if (f.volatilidade) n++;
  if (f.rtp) n++;
  n += f.outros.length;
  return n;
}

interface FixturesFilterModalProps {
  visible: boolean;
  initial: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}

export function FixturesFilterModal({ visible, initial, onApply, onClose }: FixturesFilterModalProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<FilterState>(initial);

  const setSingle = (key: keyof FilterState, id: string) =>
    setDraft((prev) => ({ ...prev, [key]: prev[key] === id ? null : id }));

  const toggleMulti = (key: "recursos" | "outros", id: string) =>
    setDraft((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.75} style={styles.closeBtn}>
            <X size={18} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtros</Text>
          <TouchableOpacity onPress={() => setDraft(DEFAULT_FILTERS)} activeOpacity={0.75}>
            <Text style={styles.clearAll}>Limpar tudo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          <Text style={styles.sectionTitle}>Esporte</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {SPORTS.map((s) => (
              <Chip
                key={s.id}
                emoji={s.emoji}
                label={s.label}
                active={draft.sport === s.id}
                onPress={() => setDraft((p) => ({ ...p, sport: s.id }))}
              />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>País</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {COUNTRIES.map((c) => (
              <Chip
                key={c.id}
                emoji={c.emoji}
                label={c.label}
                active={draft.country === c.id}
                onPress={() => setDraft((p) => ({ ...p, country: c.id }))}
              />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Popularidade</Text>
          <View style={styles.chipWrap}>
            {POPULARIDADE.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.popularidade === item.id}
                onPress={() => setSingle("popularidade", item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recursos</Text>
          <View style={styles.chipWrap}>
            {RECURSOS.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.recursos.includes(item.id)}
                onPress={() => toggleMulti("recursos", item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Volatilidade</Text>
          <View style={styles.chipWrap}>
            {VOLATILIDADE.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.volatilidade === item.id}
                onPress={() => setSingle("volatilidade", item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>RTP</Text>
          <View style={styles.chipWrap}>
            {RTP.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.rtp === item.id}
                onPress={() => setSingle("rtp", item.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Outros</Text>
          <View style={styles.chipWrap}>
            {OUTROS.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.outros.includes(item.id)}
                onPress={() => toggleMulti("outros", item.id)}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          onPress={() => {
            onApply(draft);
            onClose();
          }}
        >
          <Text style={styles.applyText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: Colors.dark.primaryMuted,
    maxHeight: "80%",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.inputBackground,
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: Colors.dark.inputBackground,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 8,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  clearAll: {
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 2,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  applyBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  applyText: {
    color: Colors.dark.background,
    fontSize: 15,
    fontWeight: "700",
  },
});
