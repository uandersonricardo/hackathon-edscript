import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Crown, TrendingUp } from "lucide-react-native";

import { Colors } from "../constants/theme";

const GOLD = "#FFD700";
const SILVER = "#C0C0C0";
const BRONZE = "#CD7F32";

const AVATARS = [
  require("../assets/avatars/1.png"),
  require("../assets/avatars/2.png"),
  require("../assets/avatars/3.png"),
  require("../assets/avatars/4.png"),
  require("../assets/avatars/5.png"),
  require("../assets/avatars/6.png"),
];

const TOP_10 = [
  { rank: 1, name: "Ulisses S.", username: "@ulissessb", earned: 20278.37, avatar: AVATARS[0] },
  { rank: 2, name: "Camila R.", username: "@camilareis", earned: 12480.51, avatar: AVATARS[1] },
  { rank: 3, name: "Bruno M.", username: "@brunomac", earned: 9320.08, avatar: AVATARS[2] },
  { rank: 4, name: "Larissa T.", username: "@laritav", earned: 5640.2, avatar: AVATARS[3] },
  { rank: 5, name: "Diego F.", username: "@diegof", earned: 4920.25, avatar: AVATARS[4] },
  { rank: 6, name: "Mariana L.", username: "@mariluz", earned: 3780.04, avatar: AVATARS[5] },
  { rank: 7, name: "Thiago C.", username: "@thiagoc", earned: 2960.58, avatar: AVATARS[0] },
  { rank: 8, name: "Fernanda P.", username: "@ferp", earned: 2340.3, avatar: AVATARS[1] },
  { rank: 9, name: "Lucas A.", username: "@lucasav", earned: 1870.92, avatar: AVATARS[2] },
  { rank: 10, name: "Juliana N.", username: "@juneves", earned: 1250.01, avatar: AVATARS[3] },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function rankColor(rank: number) {
  if (rank === 1) return GOLD;
  if (rank === 2) return SILVER;
  if (rank === 3) return BRONZE;
  return Colors.dark.textMuted;
}

function PodiumSlot({
  user,
  height,
  showCrown,
}: {
  user: (typeof TOP_10)[number];
  height: number;
  showCrown: boolean;
}) {
  const medal = rankColor(user.rank);
  const avatarSize = user.rank === 1 ? 64 : 52;

  return (
    <View style={styles.podiumSlot}>
      {showCrown && <Crown size={20} color={GOLD} fill={GOLD} style={styles.crown} />}
      <View style={[styles.podiumAvatarRing, { borderColor: medal, shadowColor: medal }]}>
        <Image source={user.avatar} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }} />
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>
        {user.name}
      </Text>
      <Text style={[styles.podiumEarned, { color: medal }]}>{formatBRL(user.earned)}</Text>
      <LinearGradient
        colors={[`${medal}50`, `${medal}00`]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.podiumBase, { height }]}
      >
        <Text style={[styles.podiumRank, { color: medal }]}>{user.rank}º</Text>
      </LinearGradient>
    </View>
  );
}

function RankRow({ user }: { user: (typeof TOP_10)[number] }) {
  return (
    <View style={styles.rankRow}>
      <Text style={styles.rankNumber}>{user.rank}º</Text>
      <Image source={user.avatar} style={styles.rankAvatar} />
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{user.name}</Text>
        <Text style={styles.rankUsername}>{user.username}</Text>
      </View>
      <View style={styles.rankEarnedWrapper}>
        <TrendingUp size={12} color={Colors.dark.primary} />
        <Text style={styles.rankEarned}>{formatBRL(user.earned)}</Text>
      </View>
    </View>
  );
}

export default function RankingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [first, second, third, ...rest] = TOP_10;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.75}>
          <ChevronLeft size={22} color={Colors.dark.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Ranking Semanal</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={styles.podiumWrapper}>
          <PodiumSlot user={second} height={80} showCrown={false} />
          <PodiumSlot user={first} height={110} showCrown />
          <PodiumSlot user={third} height={60} showCrown={false} />
        </View>

        {/* List */}
        {rest.map((user) => (
          <View key={user.rank} style={styles.rankCard}>
            <RankRow user={user} />
          </View>
        ))}
      </ScrollView>
    </View>
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
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700",
  },
  headerSub: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  podiumWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    paddingTop: 24,
    paddingBottom: 4,
  },
  podiumSlot: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  crown: {
    marginBottom: 2,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 8,
    shadowOpacity: 1,
  },
  podiumAvatarRing: {
    borderWidth: 3,
    borderRadius: 999,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 8,
    shadowOpacity: 1,
  },
  podiumName: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  podiumEarned: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  podiumBase: {
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  podiumRank: {
    fontSize: 18,
    fontWeight: "800",
  },
  rankCard: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 14,
    overflow: "hidden",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rankNumber: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "700",
    width: 24,
    textAlign: "center",
  },
  rankAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  rankInfo: {
    flex: 1,
    gap: 2,
  },
  rankName: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
  },
  rankUsername: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  rankEarnedWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rankEarned: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});
