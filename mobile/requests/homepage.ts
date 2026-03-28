const BASE_URL = "http://localhost:3333/api";

export type HomepageGame = {
  id: number | string;
  name: string;
  vendorName: string | null;
  popular: boolean;
  newGame: boolean;
};

export type HomepageMatch = {
  id: number;
  leagueName: string;
  homeTeam: { name: string; externalId: string };
  awayTeam: { name: string; externalId: string };
  odds: { home: number; draw: number | null; away: number };
  startDate: number;
  isLive: boolean;
  totalOdds: number;
};

export type HomepageGameSection = {
  type: "casino" | "liveCasino" | "virtuals";
  title: string;
  games: HomepageGame[];
};

export type HomepageFixtureSection = {
  type: "fixtures";
  title: string;
  matches: HomepageMatch[];
};

export type HomepageSection = HomepageGameSection | HomepageFixtureSection;

export type HomepageTopGame = {
  id: number;
  name: string;
  vendorName: string | null;
  winAmount: number;
};

export type HomepageData = {
  sections: HomepageSection[];
  topGames: HomepageTopGame[];
};

export async function fetchHomepage(userId: string): Promise<HomepageData> {
  const res = await fetch(`${BASE_URL}/homepage`, {
    headers: { "x-user-id": userId },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao carregar homepage");
  return json.data as HomepageData;
}
