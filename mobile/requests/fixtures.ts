import { BASE_URL } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

export interface PopularOddItem {
  fId: number;
  hcN: string;
  acN: string;
  fsd: number;
  odd: number;
  selectionName: string;
  outcomeId: number;
  fixtureInfo: string;
}

export interface SuperOddItem {
  fixtureId: number;
  eventName: string;
  betTypeName: string;
  fixtureOddPrice: number;
  homeCompetitorName: string | null;
  awayCompetitorName: string | null;
  hcBId?: number;
  acBId?: number;
  leagueName: string;
  categoryName: string;
}

export interface FixtureOdds {
  fId: number;
  hcN: string;
  hcBId?: number;
  acN: string;
  acBId?: number;
  fsd: number;
  leagueName: string;
  countryName: string;
  oCnt: number;
  home: number;
  draw: number;
  away: number;
  isLive: boolean;
}

function parseSoccerFixtures(json: any): FixtureOdds[] {
  const result: FixtureOdds[] = [];

  for (const sport of json.data ?? []) {
    for (const country of sport.cs ?? []) {
      const countryName: string = country.cN;
      for (const season of country.sns ?? []) {
        const leagueName: string = season.lName;
        const oCnt: number = season.oCnt ?? 0;
        for (const fixture of season.fs ?? []) {
          const resultadoBtg = (fixture.btgs ?? []).find((b: any) => b.btgN === "Resultado");
          if (!resultadoBtg) continue;

          const fos: any[] = resultadoBtg.fos ?? [];
          const homeFo = fos.find((fo: any) => fo.btN === "Casa");
          const drawFo = fos.find((fo: any) => fo.btN === "Empate");
          const awayFo = fos.find((fo: any) => fo.btN === "Fora");
          if (!homeFo || !drawFo || !awayFo) continue;

          result.push({
            fId: fixture.fId,
            hcN: fixture.hcN,
            hcBId: fixture.hcBId,
            acN: fixture.acN,
            acBId: fixture.acBId,
            fsd: fixture.fsd,
            leagueName,
            countryName,
            oCnt,
            home: homeFo.hO,
            draw: drawFo.hO,
            away: awayFo.hO,
            isLive: fixture.lSt ?? false,
          });
        }
      }
    }
  }

  return result;
}

export async function fetchPopularOdds(): Promise<PopularOddItem[]> {
  const res = await fetch(`${BASE_URL}/popular-odds`);
  const json = await res.json();
  return (json.data ?? []) as PopularOddItem[];
}

export async function fetchSuperOdds(): Promise<SuperOddItem[]> {
  const res = await fetch(`${BASE_URL}/super-odds`);
  const json = await res.json();
  return (json.data ?? []) as SuperOddItem[];
}

export async function fetchSoccerFixtures(): Promise<FixtureOdds[]> {
  const res = await fetch(`${BASE_URL}/fixtures/soccer`);
  const json = await res.json();
  return parseSoccerFixtures(json);
}

export function formatMatchDate(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const todayStr = now.toDateString();
  const tomorrowStr = new Date(now.getTime() + 86400000).toDateString();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  if (d.toDateString() === todayStr) return `Hoje, ${hh}:${mm}`;
  if (d.toDateString() === tomorrowStr) return `Amanhã, ${hh}:${mm}`;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  if (month === "03") {
    if (day === "21") return `Hoje, ${hh}:${mm}`;
    if (day === "22") return `Amanhã, ${hh}:${mm}`;
  }

  return `${day}/${month}, ${hh}:${mm}`;
}

export function uniqueSuperOdds(items: SuperOddItem[], max = 5): SuperOddItem[] {
  const seen = new Set<number>();
  const result: SuperOddItem[] = [];
  for (const item of items) {
    if (!seen.has(item.fixtureId)) {
      seen.add(item.fixtureId);
      result.push(item);
      if (result.length >= max) break;
    }
  }
  return result;
}

export function popularFixtures(popularOdds: PopularOddItem[], soccerFixtures: FixtureOdds[]): FixtureOdds[] {
  const fidMap = new Map(soccerFixtures.map((f) => [f.fId, f]));
  const seen = new Set<number>();
  const result: FixtureOdds[] = [];
  for (const item of popularOdds) {
    if (!seen.has(item.fId) && fidMap.has(item.fId)) {
      seen.add(item.fId);
      result.push(fidMap.get(item.fId)!);
    }
  }
  return result;
}

export interface LeagueGroup {
  key: string;
  name: string;
  countryName: string;
  oCnt: number;
  fixtures: FixtureOdds[];
}

/** Group fixtures by league and return the top N by market count (oCnt). */
export function topLeagues(fixtures: FixtureOdds[], count = 5): LeagueGroup[] {
  const map = new Map<string, LeagueGroup>();
  for (const f of fixtures) {
    const key = `${f.countryName}::${f.leagueName}`;
    if (!map.has(key)) {
      map.set(key, { key, name: f.leagueName, countryName: f.countryName, oCnt: f.oCnt, fixtures: [] });
    }
    map.get(key)!.fixtures.push(f);
  }
  return [...map.values()].sort((a, b) => b.oCnt - a.oCnt).slice(0, count);
}

// ── React Query hooks ─────────────────────────────────────────────────────────

export function usePopularOdds() {
  return useQuery({ queryKey: ["popular-odds"], queryFn: fetchPopularOdds });
}

export function useSuperOdds() {
  return useQuery({ queryKey: ["super-odds"], queryFn: fetchSuperOdds });
}

export function useSoccerFixtures() {
  return useQuery({ queryKey: ["fixtures", "soccer"], queryFn: fetchSoccerFixtures });
}
