import { BASE_URL } from "@/constants/api";

export type OnboardingOption = { label: string; value: string };

export type OnboardingMessage = {
  id: string;
  from: "user" | "agent";
  content: string;
};

export type OnboardingState = {
  history: OnboardingMessage[];
  options: OnboardingOption[] | null;
  multiSelect: boolean;
  done: boolean;
};

export type OnboardingResponse = {
  content: string;
  options: OnboardingOption[] | null;
  multiSelect: boolean;
  done: boolean;
};

export async function fetchOnboardingChat(userId: string): Promise<OnboardingState> {
  const res = await fetch(`${BASE_URL}/onboarding/chat`, {
    headers: { "x-user-id": userId },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao carregar onboarding");
  return json.data as OnboardingState;
}

export async function sendOnboardingMessage(userId: string, message: string): Promise<OnboardingResponse> {
  const res = await fetch(`${BASE_URL}/onboarding/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao enviar mensagem");
  return json.data as OnboardingResponse;
}
