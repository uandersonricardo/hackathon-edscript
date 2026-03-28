import { BASE_URL } from "@/constants/api";
import type { ApiResponse } from "../types/api";

export type HistoryEntry = {
  date: Date;
  type: "casino" | "liveCasino" | "virtual" | "fixture" | "deposit" | "withdrawal";
  value: any;
};

export type Embedding = {
  casino: number;
  casinoCategories: number[];
  liveCasino: number;
  liveCasinoCategories: number[];
  virtuals: number;
  virtualCategories: number[];
  fixtures: number;
  fixtureLeagues: number[];
};

export type RecurrentPlan = {
  name: string;
  amount: number;
  startDate: Date;
  bonus: number;
  cardBrand: string;
  cardLastDigits: string;
  cardExpirationDate: string;
  cardName: string;
};

export type Achievements = {
  rank: string;
  experience: number;
  missions: string[];
  rewards: string[];
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  imageUrl: string;
  taxDocument: string;
  address: string;
  birthDate: Date;
  balance: number;
  maxBetAmount: number;
  recurrentPlan: RecurrentPlan | null;
  embedding: Embedding;
  history: HistoryEntry[];
  achievements: Achievements;
};

export type RegisterAttributes = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  taxDocument: string;
  address: string;
  birthDate: Date;
  balance: number;
  maxBetAmount: number;
  recurrentPlan: null;
  achievements: { rank: string; experience: number; missions: string[]; rewards: string[] };
};

export async function login(username: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const json: ApiResponse<AuthUser> = await res.json();
  if (!res.ok || !json.success) throw new Error((json as any).message ?? "Credenciais inválidas");
  return json.data;
}

export async function register(attributes: RegisterAttributes): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attributes),
  });
  const json: ApiResponse<AuthUser> = await res.json();
  if (!res.ok || !json.success) throw new Error((json as any).message ?? "Erro ao criar conta");
  return json.data;
}
