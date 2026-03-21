import type { ApiResponse } from "../types/api";

const BASE_URL = "http://localhost:3333/api";

export type Category = {
  id: number;
  name: string;
  count: number;
  webCount: number;
  mobileCount: number;
  order: number;
  isCustom?: boolean;
};

export type Game = {
  categoryId: number;
  hours: string;
  id: number;
  name: string;
  newGame: boolean;
  open: boolean;
  popular: boolean;
  vendorId: number;
  minBet: number;
  maxBet: number;
  minBetBehind: number;
  maxBetBehind: number;
  fppCoefficient: number;
  defaultGameName: string;
  orderBy?: number;
  op?: number;
  on?: number;
  promoStartDate?: number;
};

export async function getCasinoCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/casino/categories`);
  const json: ApiResponse<{ categories: Category[] }> = await res.json();
  return json.data.categories;
}

export async function getCasinoGames(): Promise<Game[]> {
  const res = await fetch(`${BASE_URL}/casino/games`);
  const json: ApiResponse<{ games: Game[] }> = await res.json();
  return json.data.games;
}
