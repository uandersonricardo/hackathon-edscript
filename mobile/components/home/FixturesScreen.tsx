import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { MatchPanel } from "./MatchPanel";
import { SuperOddsPanel } from "./SuperOddsPanel";

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

function Chip({
  label,
  emoji,
  active,
  onPress,
}: {
  label: string;
  emoji?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[chipStyles.chip, active && chipStyles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      {emoji && <Text style={chipStyles.chipEmoji}>{emoji}</Text>}
      <Text style={[chipStyles.chipLabel, active && chipStyles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
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

interface FilterState {
  sport: string;
  country: string;
  popularidade: string | null;
  recursos: string[];
  volatilidade: string | null;
  rtp: string | null;
  outros: string[];
}

const DEFAULT_FILTERS: FilterState = {
  sport: "futebol",
  country: "ing",
  popularidade: null,
  recursos: [],
  volatilidade: null,
  rtp: null,
  outros: [],
};

function countActiveFilters(f: FilterState) {
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

function FilterModal({
  visible,
  initial,
  onApply,
  onClose,
}: {
  visible: boolean;
  initial: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
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
      <Pressable style={modalStyles.backdrop} onPress={onClose} />
      <View style={[modalStyles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={modalStyles.handle} />

        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.75} style={modalStyles.closeBtn}>
            <X size={18} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={modalStyles.headerTitle}>Filtros</Text>
          <TouchableOpacity onPress={() => setDraft(DEFAULT_FILTERS)} activeOpacity={0.75}>
            <Text style={modalStyles.clearAll}>Limpar tudo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={modalStyles.body}>
          <Text style={modalStyles.sectionTitle}>Esporte</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={modalStyles.chipRow}>
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

          <Text style={modalStyles.sectionTitle}>País</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={modalStyles.chipRow}>
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

          <Text style={modalStyles.sectionTitle}>Popularidade</Text>
          <View style={modalStyles.chipWrap}>
            {POPULARIDADE.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.popularidade === item.id}
                onPress={() => setSingle("popularidade", item.id)}
              />
            ))}
          </View>

          <Text style={modalStyles.sectionTitle}>Recursos</Text>
          <View style={modalStyles.chipWrap}>
            {RECURSOS.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.recursos.includes(item.id)}
                onPress={() => toggleMulti("recursos", item.id)}
              />
            ))}
          </View>

          <Text style={modalStyles.sectionTitle}>Volatilidade</Text>
          <View style={modalStyles.chipWrap}>
            {VOLATILIDADE.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.volatilidade === item.id}
                onPress={() => setSingle("volatilidade", item.id)}
              />
            ))}
          </View>

          <Text style={modalStyles.sectionTitle}>RTP</Text>
          <View style={modalStyles.chipWrap}>
            {RTP.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={draft.rtp === item.id}
                onPress={() => setSingle("rtp", item.id)}
              />
            ))}
          </View>

          <Text style={modalStyles.sectionTitle}>Outros</Text>
          <View style={modalStyles.chipWrap}>
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
          style={modalStyles.applyBtn}
          activeOpacity={0.85}
          onPress={() => {
            onApply(draft);
            onClose();
          }}
        >
          <Text style={modalStyles.applyText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
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

interface OddsRow {
  homeTeam: { name: string; imageUrl: ImageSourcePropType };
  awayTeam: { name: string; imageUrl: ImageSourcePropType };
  date: string;
  moreCount: number;
  home: number;
  draw: number;
  away: number;
}

function OddsTable({ rows }: { rows: OddsRow[] }) {
  return (
    <View style={tableStyles.container}>
      <View style={tableStyles.headerRow}>
        <View style={tableStyles.matchCell} />
        {(["1", "x", "2"] as const).map((label) => (
          <View key={label} style={tableStyles.oddCell}>
            <Text style={tableStyles.headerLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, index) => (
        <View key={index} style={tableStyles.rowCard}>
          <View style={tableStyles.matchCell}>
            <View style={tableStyles.teamsRow}>
              <Image source={row.homeTeam.imageUrl} style={tableStyles.teamLogo} />
              <Text style={tableStyles.teamName} numberOfLines={1}>
                {row.homeTeam.name}
              </Text>
            </View>
            <View style={tableStyles.teamsRow}>
              <Image source={row.awayTeam.imageUrl} style={tableStyles.teamLogo} />
              <Text style={tableStyles.teamName} numberOfLines={1}>
                {row.awayTeam.name}
              </Text>
            </View>
            <View style={tableStyles.metaRow}>
              <Text style={tableStyles.dateText}>{row.date}</Text>
              <View style={tableStyles.moreBadge}>
                <Text style={tableStyles.moreText}>+{row.moreCount}</Text>
              </View>
            </View>
          </View>

          {[row.home, row.draw, row.away].map((odd, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [tableStyles.oddButton, pressed && tableStyles.oddButtonPressed]}
            >
              <LinearGradient
                colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.20)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={tableStyles.oddGradient}
              >
                <Text style={tableStyles.oddValue}>{odd.toFixed(2)}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const tableStyles = StyleSheet.create({
  container: { marginHorizontal: 16, marginBottom: 16, gap: 8 },
  headerRow: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 4, gap: 4 },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: "hidden",
    gap: 4,
  },
  matchCell: { flex: 1, gap: 4, paddingRight: 8 },
  teamsRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  oddButton: { width: 52, borderRadius: 8, borderWidth: 0.75, borderColor: Colors.dark.primary, overflow: "hidden" },
  oddButtonPressed: { opacity: 0.7 },
  oddGradient: { paddingVertical: 6, alignItems: "center" },
  headerLabel: { color: Colors.dark.textMuted, fontSize: 12, fontWeight: "700", width: 52, textAlign: "center" },
  oddCell: { width: 52 },
  teamLogo: { width: 16, height: 16, resizeMode: "contain" },
  teamName: { color: Colors.dark.text, fontSize: 12, fontWeight: "500", flexShrink: 1 },
  dateText: { color: Colors.dark.textMuted, fontSize: 11 },
  moreBadge: { backgroundColor: Colors.dark.primaryMuted, borderRadius: 4, paddingVertical: 1, paddingHorizontal: 4 },
  moreText: { color: Colors.dark.text, fontSize: 10, fontWeight: "500" },
  oddValue: { color: Colors.dark.primary, fontSize: 13, fontWeight: "600" },
});

export function FixturesScreen() {
  const [championshipOpen, setChampionshipOpen] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Partidas rolando agora</Text>
          <Text style={styles.seeAll}>Ver todos</Text>
        </View>
        <MatchPanel
          homeTeam={{ name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") }}
          awayTeam={{ name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") }}
          odds={{ home: 1.81, draw: 3.56, away: 4.86 }}
          live
          startSecond={34 * 60 + 13}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Super odds</Text>
          <Text style={styles.seeAll}>Ver todos</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SuperOddsPanel
            championship="A-League Men · Rodada 22"
            homeTeam={{ name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") }}
            awayTeam={{ name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") }}
            conditions={[
              { label: "Auckland FC vence o jogo" },
              { label: "Mais de 2.5 gols na partida" },
              { label: "Ambos os times marcam" },
            ]}
            odd={8.45}
          />
          <SuperOddsPanel
            championship="A-League Men · Rodada 22"
            homeTeam={{ name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") }}
            awayTeam={{ name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") }}
            conditions={[
              { label: "Auckland FC vence o jogo" },
              { label: "Mais de 2.5 gols na partida" },
              { label: "Ambos os times marcam" },
            ]}
            odd={8.45}
          />
          <SuperOddsPanel
            championship="A-League Men · Rodada 22"
            homeTeam={{ name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") }}
            awayTeam={{ name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") }}
            conditions={[
              { label: "Auckland FC vence o jogo" },
              { label: "Mais de 2.5 gols na partida" },
              { label: "Ambos os times marcam" },
            ]}
            odd={8.45}
          />
        </ScrollView>

        <View style={styles.filterTriggerRow}>
          <TouchableOpacity
            style={[styles.filterButton, activeCount > 0 && styles.filterButtonActive]}
            onPress={() => setFilterModalOpen(true)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={15} color={activeCount > 0 ? Colors.dark.background : Colors.dark.text} />
            <Text style={[styles.filterButtonText, activeCount > 0 && styles.filterButtonTextActive]}>Filtrar</Text>
            {activeCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.75}
          onPress={() => setChampionshipOpen((v) => !v)}
        >
          <Text style={styles.title}>Campeonato inglês</Text>
          <ChevronDown
            size={20}
            color={Colors.dark.textMuted}
            style={{ transform: [{ rotate: championshipOpen ? "180deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        {championshipOpen && (
          <OddsTable
            rows={[
              {
                homeTeam: { name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") },
                awayTeam: { name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") },
                date: "Hoje, 14:30",
                moreCount: 224,
                home: 1.81,
                draw: 3.56,
                away: 4.86,
              },
              {
                homeTeam: { name: "Macarthur FC", imageUrl: require("../../assets/avatars/2.png") },
                awayTeam: { name: "Melbourne City", imageUrl: require("../../assets/avatars/3.png") },
                date: "Hoje, 16:00",
                moreCount: 187,
                home: 2.1,
                draw: 3.2,
                away: 3.45,
              },
              {
                homeTeam: { name: "Melbourne City", imageUrl: require("../../assets/avatars/3.png") },
                awayTeam: { name: "Auckland FC", imageUrl: require("../../assets/avatars/1.png") },
                date: "Amanhã, 19:00",
                moreCount: 98,
                home: 1.55,
                draw: 4.0,
                away: 5.5,
              },
            ]}
          />
        )}
      </ScrollView>

      <FilterModal
        visible={filterModalOpen}
        initial={filters}
        onApply={setFilters}
        onClose={() => setFilterModalOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "600",
  },
  seeAll: {
    color: Colors.dark.textMuted,
    fontSize: 13,
  },
  filterTriggerRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.dark.inputBackground,
    borderWidth: 1,
    borderColor: Colors.dark.inputBackground,
  },
  filterButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  filterButtonText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: Colors.dark.background,
  },
  filterBadge: {
    backgroundColor: Colors.dark.background,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: Colors.dark.primary,
    fontSize: 10,
    fontWeight: "800",
  },
});
