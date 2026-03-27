import type { ApiResponse } from "../types/api";

const BASE_URL = "http://localhost:3333/api";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  imageUrl: string;
  balance: number;
  maxBetAmount: number;
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
