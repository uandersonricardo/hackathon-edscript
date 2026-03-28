import { BASE_URL } from "@/constants/api";

export async function sendContextMessage(
  userId: string,
  message: string,
  section: string,
  sessionId: string,
): Promise<string> {
  const res = await fetch(`${BASE_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({ message, section, sessionId }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "Erro ao enviar mensagem");
  return json.data.response as string;
}
