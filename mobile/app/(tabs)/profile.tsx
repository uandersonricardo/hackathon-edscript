import Slider from "@react-native-community/slider";
import {
  LogOut,
  ArrowDownToLine,
  ArrowUpFromLine,
  Tag,
  Heart,
  Bell,
  Clock,
  ArrowLeftRight,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { Colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

function Avatar({ name, rank }: { name: string; rank: string }) {
  return (
    <View style={[styles.avatarContainer]}>
      <Image
        source={require("../../assets/avatars/1.png")}
        style={[
          styles.avatar,
          {
            borderColor: Colors.dark[rank as "diamond"] ?? Colors.dark.primary,
            boxShadow: `0px 0px 4px ${Colors.dark[rank as "diamond"] ?? Colors.dark.primary}`,
          },
        ]}
      />
    </View>
  );
}

const LEVEL_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
  platinum: "Platina",
  diamond: "Ametista",
};

function LevelBadge({ rank }: { rank: string }) {
  return (
    <View style={styles.levelBadge}>
      <Text style={styles.levelBadgeText}>Conta nível</Text>
      <Star size={11} color={Colors.dark.diamond} fill={Colors.dark.diamond} />
      <Text style={[styles.levelBadgeText, { color: Colors.dark.diamond }]}>{LEVEL_LABELS[rank] ?? rank}</Text>
    </View>
  );
}

function TabSwitcher({ active, onChange }: { active: "conta" | "config"; onChange: (t: "conta" | "config") => void }) {
  return (
    <View style={styles.tabSwitcher}>
      <TouchableOpacity
        style={[styles.tabItem, active === "conta" && styles.tabItemActive]}
        onPress={() => onChange("conta")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, active === "conta" && styles.tabTextActive]}>Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, active === "config" && styles.tabItemActive]}
        onPress={() => onChange("config")}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, active === "config" && styles.tabTextActive]}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
}

type GridItem = { icon: React.ReactNode; label: string; onPress?: () => void };

function GridTile({ icon, label, onPress }: GridItem) {
  return (
    <TouchableOpacity style={styles.gridTile} activeOpacity={0.7} onPress={onPress}>
      <LinearGradient
        colors={["#568469", "rgba(70, 71, 141, 0.3)"]}
        start={{ x: 0.7, y: 1 }}
        end={{ x: 0.77, y: 0 }}
        style={styles.gridTileGradient}
      >
        {icon}
        <Text style={styles.gridTileLabel}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function ContaTab({ onDeposit, onNotifications }: { onDeposit: () => void; onNotifications: () => void }) {
  const iconColor = Colors.dark.text;
  const iconSize = 20;

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.depositButton} activeOpacity={0.85} onPress={onDeposit}>
        <ArrowDownToLine size={20} color={Colors.dark.background} strokeWidth={2.5} />
        <Text style={styles.depositButtonText}>Depositar</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        <GridTile icon={<ArrowUpFromLine size={iconSize} color={iconColor} />} label="Sacar" />
        <GridTile icon={<Tag size={iconSize} color={iconColor} />} label="Promoções" />
        <GridTile icon={<Heart size={iconSize} color={iconColor} />} label="Favoritos" />
        <GridTile icon={<Bell size={iconSize} color={iconColor} />} label="Notificações" onPress={onNotifications} />
        <GridTile icon={<Clock size={iconSize} color={iconColor} />} label="Histórico" />
        <GridTile icon={<ArrowLeftRight size={iconSize} color={iconColor} />} label="Transações" />
        <GridTile icon={<Zap size={iconSize} color={iconColor} />} label="Ativar Bônus" />
        <GridTile icon={<Star size={iconSize} color={iconColor} fill={iconColor} />} label="Golden Rate" />
      </View>
    </View>
  );
}

function LimitSlider({ label, max }: { label: string; max: number }) {
  const [value, setValue] = useState(0);

  return (
    <View style={styles.sliderField}>
      <View style={styles.sliderLabelRow}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value > 0 ? `R$ ${value.toLocaleString("pt-BR")}` : "Sem limite"}</Text>
      </View>
      <Slider
        style={{ width: "100%", height: 20 }}
        minimumValue={0}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor={Colors.dark.primary}
        maximumTrackTintColor={Colors.dark.inputBackground}
        thumbTintColor={Colors.dark.primary}
      />
    </View>
  );
}

function CollapsiblePanel({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <LinearGradient
      colors={["#568469", "rgba(70, 71, 141, 0.4)"]}
      start={{ x: 0.7, y: 0.8 }}
      end={{ x: 0.77, y: 0 }}
      style={styles.panelCard}
    >
      <TouchableOpacity style={styles.panelHeader} onPress={() => setOpen((v) => !v)} activeOpacity={0.8}>
        <Text style={styles.panelTitle}>{title}</Text>
        <ChevronDown size={18} color={Colors.dark.text} style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }} />
      </TouchableOpacity>
      {open && children}
    </LinearGradient>
  );
}

function LimitPanel({ title }: { title: string }) {
  return (
    <CollapsiblePanel title={title}>
      <View style={styles.limitSliders}>
        <LimitSlider label="Diário" max={1000} />
        <LimitSlider label="Semanal" max={5000} />
        <LimitSlider label="Mensal" max={20000} />
      </View>
      <TouchableOpacity style={styles.saveLimitButton} activeOpacity={0.8}>
        <Text style={styles.saveLimitText}>Salvar limites</Text>
      </TouchableOpacity>
    </CollapsiblePanel>
  );
}

type AccessibilityItem = { label: string; description: string };

function AccessibilityToggle({ label, description }: AccessibilityItem) {
  const [enabled, setEnabled] = useState(false);
  return (
    <View style={styles.accessRow}>
      <View style={styles.accessText}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.accessDesc}>{description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{ false: Colors.dark.inputBackground, true: Colors.dark.primaryMuted }}
        thumbColor={enabled ? Colors.dark.primary : Colors.dark.text}
        ios_backgroundColor={Colors.dark.inputBackground}
      />
    </View>
  );
}

const EXCLUSION_PERIODS = ["1 semana", "1 mês", "3 meses", "6 meses", "1 ano"];

function TemporaryExclusionPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <CollapsiblePanel title="Exclusão por tempo determinado" defaultOpen={false}>
      <Text style={styles.exclusionDesc}>Suspende temporariamente o acesso à sua conta pelo período selecionado.</Text>
      <View style={styles.periodGrid}>
        {EXCLUSION_PERIODS.map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodChip, selected === period && styles.periodChipActive]}
            onPress={() => setSelected(period)}
            activeOpacity={0.8}
          >
            <Text style={[styles.periodChipText, selected === period && styles.periodChipTextActive]}>{period}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.exclusionButton, !selected && styles.exclusionButtonDisabled]}
        activeOpacity={0.8}
        disabled={!selected}
      >
        <Text style={styles.exclusionButtonText}>Confirmar exclusão</Text>
      </TouchableOpacity>
    </CollapsiblePanel>
  );
}

function SelfExclusionPanel() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <CollapsiblePanel title="Auto exclusão" defaultOpen={false}>
      <Text style={styles.exclusionDesc}>
        Encerra permanentemente o acesso à sua conta. Esta ação é irreversível e não poderá ser desfeita.
      </Text>
      <View style={styles.selfExclusionConfirm}>
        <TouchableOpacity
          style={styles.selfExclusionCheckbox}
          onPress={() => setConfirmed((v) => !v)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, confirmed && styles.checkboxActive]}>
            {confirmed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Entendo que esta ação é permanente</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.selfExclusionButton, !confirmed && styles.exclusionButtonDisabled]}
        activeOpacity={0.8}
        disabled={!confirmed}
      >
        <Text style={styles.selfExclusionButtonText}>Excluir minha conta</Text>
      </TouchableOpacity>
    </CollapsiblePanel>
  );
}

function ConfigTab() {
  return (
    <View style={styles.section}>
      <LimitPanel title="Limite de Aposta" />

      <LimitPanel title="Limite de Depósito" />

      <CollapsiblePanel title="Acessibilidade">
        <AccessibilityToggle label="Modo claro" description="Alterna para o tema claro da interface" />
        <Divider light />
        <AccessibilityToggle label="Alto contraste" description="Aumenta o contraste de cores na interface" />
        <Divider light />
        <AccessibilityToggle label="Reduzir animações" description="Desativa transições e efeitos animados" />
        <Divider light />
        <AccessibilityToggle label="Texto maior" description="Aumenta o tamanho padrão dos textos" />
      </CollapsiblePanel>

      <TemporaryExclusionPanel />

      <SelfExclusionPanel />
    </View>
  );
}

function BalancePanel({ balance }: { balance: string }) {
  return (
    <View style={styles.balanceWrapper}>
      <LinearGradient
        colors={["rgba(7,4,46,0.20)", "rgba(58,231,126,0.60)"]}
        start={{ x: 0.43, y: 0 }}
        end={{ x: 0.4, y: 0.9 }}
        style={styles.gradientWrapper}
      >
        <Text style={styles.balanceLabel}>Saldo total</Text>
        <Text style={styles.balanceText}>{balance}</Text>
      </LinearGradient>
    </View>
  );
}

function Divider({ light }: { light?: boolean }) {
  return <View style={[styles.divider, light && styles.dividerLight]} />;
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"conta" | "config">("conta");

  const name = user?.name ?? "Visitante";
  const rank = user?.achievements?.rank ?? "bronze";
  const balance = user?.balance ?? 0;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <Avatar name={name} rank={rank} />
          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{name}</Text>
            <LevelBadge rank={rank} />
          </View>
        </View>
      </View>

      <BalancePanel
        balance={`R$ ${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />

      <TabSwitcher active={activeTab} onChange={setActiveTab} />

      {activeTab === "conta" ? (
        <ContaTab onDeposit={() => router.push("/deposit")} onNotifications={() => router.push("/notifications")} />
      ) : (
        <ConfigTab />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
        <LogOut size={18} color={Colors.dark.primary} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {},
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.dark.tertiary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.dark.primary,
  },
  avatarText: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "700",
  },
  profileMeta: {
    gap: 6,
  },
  profileName: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "700",
    width: "100%",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.dark.inputBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  levelBadgeText: {
    color: Colors.dark.text,
    fontSize: 11,
    fontWeight: "600",
  },
  profileRight: {
    alignItems: "flex-end",
    gap: 10,
  },
  balanceBox: {
    alignItems: "flex-end",
  },
  balanceValue: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  logoutButton: {
    padding: 16,
    borderRadius: 14,
    margin: 16,
    backgroundColor: Colors.dark.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  logoutText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  tabSwitcher: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 13,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: Colors.dark.primaryLight,
  },
  tabText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: Colors.dark.inputBackground,
  },
  section: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    paddingVertical: 4,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.inputBackground,
    marginHorizontal: 16,
  },
  dividerLight: {
    backgroundColor: "rgba(159,234,188,0.2)",
  },
  depositButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    boxShadow: `0px 4px 12px ${Colors.dark.primary}`,
  },
  depositButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "700",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dark.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "#2A0A0A",
  },
  menuLabel: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "500",
  },
  menuLabelDanger: {
    color: "#FF6B6B",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridTile: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.primaryLight,
    overflow: "hidden",
  },
  gridTileGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gridTileLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
  panelCard: {
    borderRadius: 16,
    borderColor: Colors.dark.primaryLight,
    overflow: "hidden",
    paddingVertical: 4,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  panelTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontWeight: "700",
  },
  limitSliders: {
    paddingHorizontal: 16,
    gap: 20,
    paddingBottom: 4,
  },
  sliderField: {
    gap: 10,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderLabel: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "500",
  },
  sliderValue: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "700",
  },
  sliderTrack: {
    height: 6,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 3,
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.dark.primary,
    boxShadow: `0px 0px 6px ${Colors.dark.primary}`,
  },
  saveLimitButton: {
    margin: 12,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveLimitText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: "700",
  },
  accessRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  accessText: {
    flex: 1,
    gap: 2,
  },
  accessDesc: {
    color: Colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
  },
  exclusionDesc: {
    color: Colors.dark.text,
    fontSize: 13,
    opacity: 0.8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20,
  },
  periodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 16,
  },
  periodChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(159,234,188,0.4)",
    backgroundColor: "rgba(159,234,188,0.08)",
  },
  periodChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  periodChipText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "500",
  },
  periodChipTextActive: {
    color: Colors.dark.background,
    fontWeight: "700",
  },
  exclusionButton: {
    margin: 12,
    marginTop: 0,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  exclusionButtonDisabled: {
    opacity: 0.35,
  },
  exclusionButtonText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: "700",
  },
  selfExclusionConfirm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  selfExclusionCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(159,234,188,0.5)",
    backgroundColor: "rgba(159,234,188,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#e34545",
    borderColor: "#e34545",
  },
  checkmark: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  checkboxLabel: {
    color: Colors.dark.text,
    fontSize: 13,
    opacity: 0.9,
    flex: 1,
  },
  selfExclusionButton: {
    margin: 12,
    marginTop: 0,
    backgroundColor: "#e34545",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  selfExclusionButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
  },
  balanceWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    overflow: "hidden",
    gap: 8,
  },
  gradientWrapper: {
    width: "100%",
    padding: 10,
    gap: 2,
  },
  balanceText: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: 600,
  },
  balanceLabel: {
    color: Colors.dark.primaryLight,
    fontSize: 15,
  },
});
