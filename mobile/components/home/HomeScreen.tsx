import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { Colors } from "@/constants/theme";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { TopWinPanel } from "@/components/home/TopWinPanel";
import { TopGamePanel } from "@/components/home/TopGamePanel";
import { FutureMatchPanel } from "@/components/home/FutureMatchPanel";
import { CasinoButton } from "@/components/home/CasinoButton";
import { VirtualButton } from "@/components/home/VirtualButton";
import { HomeScreenSkeleton } from "@/components/home/Skeleton";
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchHomepage, type HomepageSection, type HomepageTopGame } from "@/requests/homepage";
import { getCasinoImage, getLiveCasinoImage, getTeamImage } from "@/utils/images";
import { getVirtualImage, getVirtualBackground } from "@/utils/virtualImages";

const dailyPrize = require("../../assets/elements/premio_diario.png");

const SECTION_CATEGORY: Record<string, string> = {
  casino: "Cassino",
  liveCasino: "Cassino ao vivo",
  virtuals: "Virtuais",
  fixtures: "Esportes",
};

function SectionHeader({ title, sectionType }: { title: string; sectionType: string }) {
  const { setActiveCategory } = useSearch();
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveCategory(SECTION_CATEGORY[sectionType])}>
        <Text style={styles.seeAll}>Ver todos</Text>
      </TouchableOpacity>
    </View>
  );
}

function FixtureSection({ section }: { section: HomepageSection & { type: "fixtures" } }) {
  return (
    <View>
      <SectionHeader title={section.title} sectionType="fixtures" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fixtureRow}>
        {section.matches.map((match) => (
          <View key={match.id} style={styles.fixtureCard}>
            <FutureMatchPanel
              homeTeam={{ name: match.homeTeam.name, imageUrl: { uri: getTeamImage(match.homeTeam.externalId) } }}
              awayTeam={{ name: match.awayTeam.name, imageUrl: { uri: getTeamImage(match.awayTeam.externalId) } }}
              odds={{ home: match.odds.home, draw: match.odds.draw ?? match.odds.home, away: match.odds.away }}
              date={new Date(match.startDate).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
              live={match.isLive}
              more={match.totalOdds}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function CasinoSection({ section }: { section: HomepageSection & { type: "casino" | "liveCasino" } }) {
  const getImageFn = section.type === "casino" ? getCasinoImage : getLiveCasinoImage;
  return (
    <View>
      <SectionHeader title={section.title} sectionType={section.type} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gameRow}>
        {section.games.map((game) => (
          <View key={game.id} style={styles.gameCard}>
            <CasinoButton
              label={game.name}
              icon={{ uri: getImageFn(game.id) }}
              vendorName={game.vendorName}
              popular={game.popular}
              newGame={game.newGame}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function VirtualSection({ section }: { section: HomepageSection & { type: "virtuals" } }) {
  return (
    <View>
      <SectionHeader title={section.title} sectionType="virtuals" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gameRow}>
        {section.games.map((game) => (
          <View key={game.id} style={styles.gameCard}>
            <VirtualButton
              label={game.name}
              icon={getVirtualImage(String(game.id))}
              background={getVirtualBackground(String(game.id)) ?? Colors.dark.inputBackground}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function TopGamesSection({ games }: { games: HomepageTopGame[] }) {
  const { setActiveCategory } = useSearch();
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Jogos que mais renderam hoje</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveCategory("Cassino")}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topGamesRow}>
        {games.map((game, i) => (
          <TopGamePanel
            key={game.id}
            position={i + 1}
            name={game.name}
            winAmount={game.winAmount}
            imageUrl={{ uri: getCasinoImage(game.id) }}
            vendorName={game.vendorName}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function SectionBlock({ section }: { section: HomepageSection }) {
  if (section.type === "fixtures") return <FixtureSection section={section} />;
  if (section.type === "virtuals") return <VirtualSection section={section as any} />;
  return <CasinoSection section={section as any} />;
}

export function HomeScreen() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["homepage", user?.id],
    queryFn: () => fetchHomepage(user!.id),
    enabled: !!user,
  });

  const fixtureSection = data?.sections.find((s) => s.type === "fixtures");
  const otherSections = data?.sections.filter((s) => s.type !== "fixtures") ?? [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.carouselFixedOuter}>
          <Link href="/wheel" asChild>
            <TouchableOpacity style={styles.carouselFixedInner} activeOpacity={0.85}>
              <Image source={dailyPrize} style={styles.carouselImage} resizeMode="contain" />
            </TouchableOpacity>
          </Link>
        </View>
        <BannerCarousel />
      </View>

      <TopWinPanel />

      {isLoading && <HomeScreenSkeleton />}

      {fixtureSection && <SectionBlock section={fixtureSection} />}

      {data?.topGames && data.topGames.length > 0 && <TopGamesSection games={data.topGames} />}

      {otherSections.map((section) => (
        <SectionBlock key={section.type} section={section} />
      ))}

      <View style={{ width: 1, height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  carouselContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  carouselFixedOuter: {
    shadowColor: Colors.dark.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 8,
    shadowOpacity: 1,
  },
  carouselFixedInner: {
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.dark.tertiaryStroke,
    backgroundColor: Colors.dark.background,
    overflow: "hidden",
  },
  carouselImage: {
    height: 110,
    width: 130,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
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
  fixtureRow: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 0,
  },
  fixtureCard: {
    width: 350,
    marginHorizontal: -8,
    marginBottom: -16,
  },
  gameRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  gameCard: {
    width: 120,
  },
  topGamesRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
