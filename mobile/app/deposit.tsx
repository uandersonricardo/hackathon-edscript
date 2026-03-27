import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Info,
} from "lucide-react-native";

import { Colors } from "../constants/theme";

const PROVIDERS = [
  { id: "paybrokers", label: "Paybrokers", badge: "Popular" },
  { id: "zropay", label: "Zro Pay", badge: null },
];

const SUGGESTED = [10, 30, 50, 100, 300, 1000];

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBRL(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const INFO_ITEMS = [
  "O valor mínimo para depósito é R$ 10,00",
  "O crédito será processado instantaneamente",
  "Mantenha o aplicativo aberto até a confirmação",
];

export default function DepositScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [provider, setProvider] = useState("paybrokers");
  const [amountCents, setAmountCents] = useState(0);

  const handleAmountChange = (text: string) => {
    setAmountCents(parseBRL(text));
  };

  const displayValue = amountCents === 0 ? "" : formatBRL(amountCents);

  const isValid = amountCents >= 1000; // R$ 10,00 minimum

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento PIX</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Security badge */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={18} color={Colors.dark.primary} />
          <View>
            <Text style={styles.securityTitle}>Transação segura</Text>
            <Text style={styles.securitySub}>Seus dados estão protegidos</Text>
          </View>
        </View>

        {/* Provider */}
        <Text style={styles.sectionLabel}>Selecione o provedor do PIX</Text>
        <View style={styles.providersCard}>
          {PROVIDERS.map((p, i) => {
            const active = provider === p.id;
            return (
              <Pressable
                key={p.id}
                style={[styles.providerRow, i < PROVIDERS.length - 1 && styles.providerRowBorder]}
                onPress={() => setProvider(p.id)}
              >
                {active ? (
                  <CheckCircle2 size={20} color={Colors.dark.primary} />
                ) : (
                  <Circle size={20} color={Colors.dark.textMuted} />
                )}
                <Text style={[styles.providerLabel, active && styles.providerLabelActive]}>
                  {p.label}
                </Text>
                {p.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{p.badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Amount input */}
        <Text style={styles.sectionLabel}>Valor do depósito</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="R$ 0,00"
          placeholderTextColor={Colors.dark.textMuted}
          selectionColor={Colors.dark.primary}
          keyboardType="number-pad"
          value={displayValue}
          onChangeText={handleAmountChange}
        />

        {/* Suggested values */}
        <Text style={styles.sectionLabel}>Valores sugeridos</Text>
        <View style={styles.suggestedGrid}>
          {SUGGESTED.map((v) => {
            const active = amountCents === v * 100;
            return (
              <Pressable
                key={v}
                style={[styles.suggestedChip, active && styles.suggestedChipActive]}
                onPress={() => setAmountCents(v * 100)}
              >
                <Text style={[styles.suggestedChipText, active && styles.suggestedChipTextActive]}>
                  R$ {v}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, !isValid && styles.ctaButtonDisabled]}
          activeOpacity={0.85}
          disabled={!isValid}
        >
          <Text style={styles.ctaButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={15} color={Colors.dark.textMuted} />
            <Text style={styles.infoTitle}>Informações importantes:</Text>
          </View>
          {INFO_ITEMS.map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 12,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.dark.primaryMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  securityTitle: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "700",
  },
  securitySub: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  sectionLabel: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  providersCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.inputBackground,
    overflow: "hidden",
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  providerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBackground,
  },
  providerLabel: {
    color: Colors.dark.textMuted,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  providerLabelActive: {
    color: Colors.dark.text,
  },
  badge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.dark.background,
    fontSize: 11,
    fontWeight: "700",
  },
  amountInput: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
  },
  suggestedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestedChip: {
    width: "30%",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.dark.inputBackground,
    paddingVertical: 11,
    backgroundColor: Colors.dark.card,
  },
  suggestedChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primaryMuted,
  },
  suggestedChipText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  suggestedChipTextActive: {
    color: Colors.dark.primary,
  },
  ctaButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.inputBackground,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  infoTitle: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  infoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.dark.textMuted,
    marginTop: 5,
  },
  infoText: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    flex: 1,
  },
});
