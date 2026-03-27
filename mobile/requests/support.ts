const BASE_URL = "http://localhost:3333/api";

export type ChatMessage = {
  id: string;
  from: "user" | "agent";
  content: string;
};

export async function fetchChatHistory(userId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${BASE_URL}/support/chat`, {
    headers: { "x-user-id": userId },
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao carregar histórico");
  return json.data as ChatMessage[];
}

export async function sendMessage(userId: string, message: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/support/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao enviar mensagem");
  return json.data.response as string;
}

export async function resetChatHistory(userId: string): Promise<void> {
  await fetch(`${BASE_URL}/support/chat`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });
}
