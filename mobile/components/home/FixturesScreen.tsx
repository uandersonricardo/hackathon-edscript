import {
  ActivityIndicator,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react-native";

import { Colors } from "@/constants/theme";
import { getTeamImage } from "@/utils/images";
import { FutureMatchPanel } from "./FutureMatchPanel";
import { SuperOddsPanel } from "./SuperOddsPanel";
import { LiveMatchPanel } from "./LiveMatchPanel";
import { OddsTable } from "./OddsTable";
import { FixturesFilterModal, FilterState, DEFAULT_FILTERS, countActiveFilters } from "./FixturesFilterModal";
import {
  type FixtureOdds,
  type LeagueGroup,
  type SuperOddItem,
  formatMatchDate,
  popularFixtures,
  topLeagues,
  uniqueSuperOdds,
  usePopularOdds,
  useSoccerFixtures,
  useSuperOdds,
} from "@/requests/fixtures";

// ── Avatar helpers ────────────────────────────────────────────────────────────

const AVATARS = [
  require("../../assets/avatars/1.png"),
  require("../../assets/avatars/2.png"),
  require("../../assets/avatars/3.png"),
  require("../../assets/avatars/4.png"),
  require("../../assets/avatars/5.png"),
  require("../../assets/avatars/6.png"),
] as const;

function avatarFor(name: string): ImageSourcePropType {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATARS[Math.abs(hash) % AVATARS.length];
}

function teamImage(bId: string | number | undefined, name: string): ImageSourcePropType {
  if (bId) return { uri: getTeamImage(bId) };
  return avatarFor(name);
}

function parseSuperOddsTeams(item: SuperOddItem): { home: string; away: string } {
  if (item.homeCompetitorName && item.awayCompetitorName) {
    return { home: item.homeCompetitorName, away: item.awayCompetitorName };
  }
  const parts = item.eventName.split(/\s+x\s+/i);
  return { home: parts[0]?.trim() ?? item.eventName, away: parts[1]?.trim() ?? "" };
}

function parseSuperOddsConditions(betTypeName: string) {
  return betTypeName
    .replace(/\s*\(Era\s+[\d.]+\)/gi, "")
    .split("&")
    .map((s) => ({ label: s.trim() }))
    .filter((c) => c.label.length > 0);
}

const SIMULATED_SECONDS = [34 * 60 + 13, 12 * 60 + 45, 67 * 60 + 22];
const SIMULATED_SCORES = [
  { homeScore: 0, awayScore: 1 },
  { homeScore: 2, awayScore: 0 },
  { homeScore: 1, awayScore: 1 },
];

function fixtureToLiveProps(f: FixtureOdds, index: number) {
  const s = SIMULATED_SCORES[index % SIMULATED_SCORES.length];
  return {
    championshipName: f.leagueName,
    homeTeam: { name: f.hcN, imageUrl: teamImage(f.hcBId, f.hcN), score: s.homeScore },
    awayTeam: { name: f.acN, imageUrl: teamImage(f.acBId, f.acN), score: s.awayScore },
    odds: { home: f.home, draw: f.draw, away: f.away },
    startSecond: SIMULATED_SECONDS[index % SIMULATED_SECONDS.length],
  };
}

function leagueToOddsRows(league: LeagueGroup) {
  return league.fixtures.map((f) => ({
    homeTeam: { name: f.hcN, imageUrl: teamImage(f.hcBId, f.hcN) },
    awayTeam: { name: f.acN, imageUrl: teamImage(f.acBId, f.acN) },
    date: formatMatchDate(f.fsd),
    moreCount: f.oCnt,
    home: f.home,
    draw: f.draw,
    away: f.away,
  }));
}

function LeagueSection({ league }: { league: LeagueGroup }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <TouchableOpacity style={styles.titleContainer} activeOpacity={0.75} onPress={() => setOpen((v) => !v)}>
        <View style={styles.leagueTitleGroup}>
          <Text style={styles.title}>{league.name}</Text>
          <Text style={styles.leagueCountry}>{league.countryName}</Text>
        </View>
        <ChevronDown
          size={20}
          color={Colors.dark.textMuted}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {open && <OddsTable rows={leagueToOddsRows(league)} leagueName={league.name} />}
    </>
  );
}

export function FixturesScreen() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const scrollRef = useRef<ScrollView>(null);
  const filterRowY = useRef(0);

  const popularOddsQuery = usePopularOdds();
  const superOddsQuery = useSuperOdds();
  const soccerQuery = useSoccerFixtures();

  const loading = popularOddsQuery.isLoading || superOddsQuery.isLoading || soccerQuery.isLoading;

  const soccerData = soccerQuery.data ?? [];
  const popularOddsData = popularOddsQuery.data ?? [];
  const superOddsData = superOddsQuery.data ?? [];

  const liveFixtures = soccerData
    .filter((f) => f.isLive)
    .concat(soccerData)
    .slice(0, 3);
  const superOdds = uniqueSuperOdds(superOddsData, 3);
  const popularMatchFixtures = popularFixtures(popularOddsData, soccerData).slice(0, 3);
  const leagues = topLeagues(soccerData, 5);

  const activeCount = countActiveFilters(filters);
  const scrollToFilter = () => scrollRef.current?.scrollTo({ y: filterRowY.current, animated: true });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView ref={scrollRef} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.75}>
            <ChevronLeft size={22} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cassino</Text>
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

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Partidas rolando agora</Text>
          <TouchableOpacity onPress={scrollToFilter} activeOpacity={0.75}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {liveFixtures.map((f, i) => (
            <LiveMatchPanel key={f.fId} {...fixtureToLiveProps(f, i)} />
          ))}
        </ScrollView>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Super odds</Text>
          <TouchableOpacity onPress={scrollToFilter} activeOpacity={0.75}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {superOdds.map((item) => {
            const teams = parseSuperOddsTeams(item);
            return (
              <SuperOddsPanel
                key={item.fixtureId}
                championship={item.leagueName}
                homeTeam={{ name: teams.home, imageUrl: teamImage(item.hcBId, teams.home) }}
                awayTeam={{ name: teams.away, imageUrl: teamImage(item.acBId, teams.away) }}
                conditions={parseSuperOddsConditions(item.betTypeName)}
                odd={item.fixtureOddPrice}
              />
            );
          })}
        </ScrollView>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Partidas populares</Text>
          <TouchableOpacity onPress={scrollToFilter} activeOpacity={0.75}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {popularMatchFixtures.map((f) => (
          <FutureMatchPanel
            key={f.fId}
            homeTeam={{ name: f.hcN, imageUrl: teamImage(f.hcBId, f.hcN) }}
            awayTeam={{ name: f.acN, imageUrl: teamImage(f.acBId, f.acN) }}
            odds={{ home: f.home, draw: f.draw, away: f.away }}
            date={formatMatchDate(f.fsd)}
          />
        ))}

        {leagues.map((league) => (
          <LeagueSection key={league.key} league={league} />
        ))}
      </ScrollView>

      <FixturesFilterModal
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  leagueTitleGroup: {
    gap: 2,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
  },
  leagueCountry: {
    color: Colors.dark.textMuted,
    fontSize: 12,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 0,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "600",
  },
});
