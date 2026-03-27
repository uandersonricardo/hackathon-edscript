import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "../../constants/theme";
import { CalendarIcon, CheckCircleIcon } from "lucide-react-native";

const PERIOD_FILTERS = [
  { label: "Últimos 3 dias", value: 3 },
  { label: "Últimos 7 dias", value: 7 },
  { label: "Últimos 14 dias", value: 14 },
];

const STATUS_FILTERS = [
  { label: "Aberta", value: "open" },
  { label: "Cashout", value: "cashout" },
  { label: "Aposta encerrada", value: "closed" },
];

const TIPS = [
  "Acompanhe suas apostas em tempo real",
  "Utilize o cashout para garantir seus ganhos",
  "Consulte o histórico completo de todas as apostas",
];

export default function History() {
  const [activePeriod, setActivePeriod] = useState(3);
  const [activeStatus, setActiveStatus] = useState("open");

  const periodLabel = PERIOD_FILTERS.find((f) => f.value === activePeriod)?.label ?? "";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Histórico de Apostas</Text>

      <View style={styles.filterRow}>
        {PERIOD_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[styles.filterChip, activePeriod === f.value && styles.filterChipActive]}
            onPress={() => setActivePeriod(f.value)}
          >
            <Text style={[styles.filterChipText, activePeriod === f.value && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.statusRow}>
        {STATUS_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[styles.statusChip, activeStatus === f.value && styles.statusChipActive]}
            onPress={() => setActiveStatus(f.value)}
          >
            <Text style={[styles.statusChipText, activeStatus === f.value && styles.statusChipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.emptyState}>
        <View style={styles.emptyIconWrapper}>
          <CalendarIcon size={48} color={Colors.dark.primary} />
        </View>
        <Text style={styles.emptyTitle}>Nenhuma aposta encontrada</Text>
        <Text style={styles.emptySubtitle}>Você não possui apostas abertas nos {periodLabel.toLowerCase()}</Text>

        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>+{"   "}Fazer uma aposta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Dicas para suas apostas:</Text>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <CheckCircleIcon size={16} color={Colors.dark.primary} style={styles.tipIcon} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  filterRowContent: {
    gap: 8,
  },
  filterChip: {
    borderRadius: 10,
    backgroundColor: Colors.dark.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary,
  },
  filterChipText: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: Colors.dark.background,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statusChip: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.dark.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  statusChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary,
  },
  statusChipText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "600",
  },
  statusChipTextActive: {
    color: Colors.dark.background,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 28,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    width: "100%",
    alignItems: "center",
  },
  ctaButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "700",
  },
  tipsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.inputBackground,
    padding: 16,
    gap: 10,
  },
  tipsTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipIcon: {
    marginTop: 1,
  },
  tipText: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    flex: 1,
  },
});
