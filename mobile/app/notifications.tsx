import { useQuery } from "@tanstack/react-query";
import { Bot, Bell, ChevronRight, CheckCircle, ChevronLeft } from "lucide-react-native";
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { fetchNotifications, type AgenticNotification, type Notification } from "../requests/notifications";

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}m atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)}d atrás`;
}

type SectionKey = "today" | "yesterday" | "week" | "older";

const SECTION_LABELS: Record<SectionKey, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  week: "Na última semana",
  older: "Mais antigas",
};

function getSection(iso: string): SectionKey {
  const now = new Date();
  const date = new Date(iso);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 864e5;
  const weekStart = todayStart - 6 * 864e5;
  const ts = date.getTime();
  if (ts >= todayStart) return "today";
  if (ts >= yesterdayStart) return "yesterday";
  if (ts >= weekStart) return "week";
  return "older";
}

type Section = { key: SectionKey; label: string; items: Notification[] };

function groupBySections(notifications: Notification[]): Section[] {
  const order: SectionKey[] = ["today", "yesterday", "week", "older"];
  const map = new Map<SectionKey, Notification[]>();
  for (const n of notifications) {
    const key = getSection(n.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(n);
  }
  return order.filter((k) => map.has(k)).map((k) => ({ key: k, label: SECTION_LABELS[k], items: map.get(k)! }));
}

const AGENT_META: Record<
  AgenticNotification["agent"],
  { label: string; image: ReturnType<typeof require>; color: string; gradientColors: [string, string] }
> = {
  onboarding: {
    label: "Onboarding",
    image: require("../assets/elements/onboarding.png"),
    color: "#3B82F6",
    gradientColors: ["rgba(59,130,246,0.33)", "rgba(59,130,246,0.04)"],
  },
  tipster: {
    label: "Tipster",
    image: require("../assets/elements/tipster.png"),
    color: Colors.dark.primary,
    gradientColors: ["rgba(58,231,126,0.18)", "rgba(58,231,126,0.04)"],
  },
  support: {
    label: "Suporte",
    image: require("../assets/elements/support.png"),
    color: Colors.dark.secondary,
    gradientColors: ["rgba(231,225,58,0.18)", "rgba(231,225,58,0.04)"],
  },
};

// ── Agent avatar with pulse glow ──────────────────────────────────────────────

function AgentAvatar({ agent, read }: { agent: AgenticNotification["agent"]; read: boolean }) {
  const meta = AGENT_META[agent];
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 1400, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <View style={styles.agentAvatarWrap}>
      {!read && <Animated.View style={[styles.agentAvatarGlow, { backgroundColor: meta.color, opacity: pulse }]} />}
      <View style={[styles.agentAvatarCircle, { borderColor: meta.color }]}>
        <Image source={meta.image} style={styles.agentAvatarImage} resizeMode="contain" />
      </View>
    </View>
  );
}

// ── Normal card ───────────────────────────────────────────────────────────────

function NormalCard({ notification }: { notification: Notification & { type: "normal" } }) {
  return (
    <View style={[styles.row, notification.read && styles.rowRead]}>
      <View style={styles.normalIconWrap}>
        <Bell size={18} color={Colors.dark.primary} />
      </View>
      <View style={styles.rowInfo}>
        <View style={styles.rowTitleLine}>
          <Text style={[styles.rowTitle, notification.read && styles.textDim]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.timeText}>{timeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={[styles.rowBody, notification.read && styles.textDim]} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </View>
  );
}

// ── Bet block ─────────────────────────────────────────────────────────────────

function BetBlock({ bet, color }: { bet: NonNullable<AgenticNotification["bet"]>; color: string }) {
  const potential = (bet.odd * bet.amount).toFixed(2);
  return (
    <View style={styles.betBlock}>
      <View style={[styles.betDivider, { backgroundColor: color }]} />
      <View style={styles.betContent}>
        <Text style={styles.betMatch}>{bet.match}</Text>
        <Text style={[styles.betSelection, { color }]}>{bet.selection}</Text>
        <View style={styles.betStatsRow}>
          <View style={styles.betStat}>
            <Text style={styles.betStatLabel}>Odd</Text>
            <Text style={[styles.betStatValue, { color }]}>{bet.odd.toFixed(2)}</Text>
          </View>
          <View style={styles.betStatSep} />
          <View style={styles.betStat}>
            <Text style={styles.betStatLabel}>Valor</Text>
            <Text style={styles.betStatValue}>R$ {bet.amount}</Text>
          </View>
          <View style={styles.betStatSep} />
          <View style={styles.betStat}>
            <Text style={styles.betStatLabel}>Potencial</Text>
            <Text style={[styles.betStatValue, { color: Colors.dark.primary }]}>R$ {potential}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: color }]} activeOpacity={0.8}>
          <CheckCircle size={14} color={Colors.dark.background} />
          <Text style={[styles.confirmText]}>Confirmar aposta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Agentic card ──────────────────────────────────────────────────────────────

function AgenticCard({ notification }: { notification: AgenticNotification }) {
  const meta = AGENT_META[notification.agent];
  const router = useRouter();

  return (
    <View style={[styles.agenticOuter, notification.read && styles.rowRead]}>
      <LinearGradient
        colors={notification.read ? ["transparent", "transparent"] : meta.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.agenticGradient}
      >
        {/* Top row */}
        <View style={styles.agenticTop}>
          <AgentAvatar agent={notification.agent} read={notification.read} />
          <View style={styles.rowInfo}>
            <View style={styles.rowTitleLine}>
              <View style={styles.agentLabelRow}>
                <Bot size={11} color={meta.color} />
                <Text style={[styles.agentLabel, { color: meta.color }]}>{meta.label}</Text>
              </View>
              <Text style={styles.timeText}>{timeAgo(notification.createdAt)}</Text>
              {!notification.read && <View style={styles.unreadDotSmall} />}
            </View>
            <Text style={[styles.rowTitle, notification.read && styles.textDim]}>{notification.title}</Text>
            <Text style={[styles.rowBody, notification.read && styles.textDim]}>{notification.body}</Text>
          </View>
        </View>

        {notification.bet && <BetBlock bet={notification.bet} color={meta.color} />}

        {notification.supportAction && (
          <TouchableOpacity
            style={[styles.supportBtn, { backgroundColor: meta.color }]}
            activeOpacity={0.8}
            onPress={() => router.push(`/${notification.supportAction!.target}` as any)}
          >
            <Text style={[styles.supportBtnText]}>{notification.supportAction.label}</Text>
            <ChevronRight size={14} color={Colors.dark.background} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user,
  });

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ChevronLeft size={22} color={Colors.dark.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notificações</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.backButton}></View>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.dark.primary} size="large" />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Não foi possível carregar as notificações.</Text>
        </View>
      )}

      {data && (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {groupBySections(data).map((section) => (
            <View key={section.key}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <View style={styles.sectionItems}>
                {section.items.map((notification) =>
                  notification.type === "agentic" ? (
                    <AgenticCard key={notification.id} notification={notification} />
                  ) : (
                    <NormalCard key={notification.id} notification={notification as any} />
                  ),
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  // ── Header (mirrors ranking.tsx) ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
  },
  unreadBadge: {
    backgroundColor: Colors.dark.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: Colors.dark.background,
    fontSize: 11,
    fontWeight: "700",
  },
  // ── List ──
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 20,
  },
  sectionLabel: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionItems: {
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  // ── Shared row layout ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    overflow: "hidden",
  },
  rowRead: {
    opacity: 0.55,
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  rowBody: {
    color: Colors.dark.text,
    fontSize: 12,
    lineHeight: 18,
  },
  timeText: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    marginLeft: "auto",
    flexShrink: 0,
  },
  textDim: {
    color: Colors.dark.textMuted,
  },
  unreadDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primary,
  },
  unreadDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.dark.primary,
  },
  // ── Normal icon ──
  normalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  // ── Agentic card ──
  agenticOuter: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.dark.inputBackground,
  },
  agenticGradient: {
    padding: 14,
    gap: 10,
  },
  agenticTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  agentAvatarWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  agentAvatarGlow: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  agentAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.text,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  agentAvatarImage: {
    width: 28,
    height: 28,
  },
  agentLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  agentLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // ── Bet block ──
  betBlock: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 4,
  },
  betDivider: {
    width: 2,
    borderRadius: 1,
  },
  betContent: {
    flex: 1,
    gap: 6,
  },
  betMatch: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "600",
  },
  betSelection: {
    fontSize: 13,
    fontWeight: "700",
  },
  betStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  betStat: {
    gap: 1,
  },
  betStatSep: {
    width: 1,
    height: 24,
    backgroundColor: Colors.dark.inputBackground,
  },
  betStatLabel: {
    color: Colors.dark.textMuted,
    fontSize: 10,
  },
  betStatValue: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 2,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.dark.background,
  },
  // ── Support action ──
  supportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
    paddingVertical: 8,
  },
  supportBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.dark.background,
  },
});
