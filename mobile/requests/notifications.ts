import { BASE_URL } from "@/constants/api";

export type BetSuggestion = {
  match: string;
  selection: string;
  odd: number;
  amount: number;
};

export type NormalNotification = {
  id: string;
  type: "normal";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type AgenticNotification = {
  id: string;
  type: "agentic";
  agent: "onboarding" | "tipster" | "support";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  bet?: BetSuggestion;
  supportAction?: { label: string; target: string };
};

export type Notification = NormalNotification | AgenticNotification;

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: { "x-user-id": userId },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao carregar notificações");
  return json.data as Notification[];
}
