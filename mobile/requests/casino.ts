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
  vendorName: string | null;
  orderBy?: number;
  op?: number;
  on?: number;
  promoStartDate?: number;
};

export type GamesPage = {
  games: Game[];
  total: number;
  page: number;
  limit: number;
};

export async function getCasinoCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/casino/categories`);
  const json: ApiResponse<{ categories: Category[] }> = await res.json();
  return json.data.categories;
}

export async function getCasinoGames(page = 1, limit = 21, categoryId?: number): Promise<GamesPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (categoryId != null) params.set("categoryId", String(categoryId));
  const res = await fetch(`${BASE_URL}/casino/games?${params}`);
  const json: ApiResponse<GamesPage> = await res.json();
  return json.data;
}

export async function getLiveCasinoCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/live-casino/categories`);
  const json: ApiResponse<{ categories: Category[] }> = await res.json();
  return json.data.categories;
}

export async function getLiveCasinoGames(page = 1, limit = 21, categoryId?: number): Promise<GamesPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (categoryId != null) params.set("categoryId", String(categoryId));
  const res = await fetch(`${BASE_URL}/live-casino/games?${params}`);
  const json: ApiResponse<GamesPage> = await res.json();
  return json.data;
}

export type VirtualGame = {
  iframeProviderGameId: string;
  name: string;
  order: string;
  icon: string;
  categoryId: string;
  instant?: boolean;
};

export type VirtualGamesPage = {
  games: VirtualGame[];
  total: number;
  page: number;
  limit: number;
};

export async function getVirtualCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/virtuals/categories`);
  const json: ApiResponse<{ categories: Category[] }> = await res.json();
  return json.data.categories;
}

export async function getVirtualGames(page = 1, limit = 21, categoryId?: number): Promise<VirtualGamesPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (categoryId != null) params.set("categoryId", String(categoryId));
  const res = await fetch(`${BASE_URL}/virtuals/games?${params}`);
  const json: ApiResponse<VirtualGamesPage> = await res.json();
  return json.data;
}
