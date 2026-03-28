type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

class LLM {
  private history: Message[] = [];
  private model: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(options?: {
    model?: string;
  }) {
    this.apiKey = process.env.OPEN_ROUTER_API_KEY || "";
    this.model = options?.model || "google/gemini-3-flash-preview";
    this.baseUrl = "https://openrouter.ai/api/v1/chat/completions";
  }

  public async query(prompt: string): Promise<string> {
    this.history.push({ role: "user", content: prompt });

    const response = await this.request(this.history);

    this.history.push({ role: "assistant", content: response });

    return response;
  }

  public reset() {
    this.history = [];
  }

  public setSystemPrompt(prompt: string) {
    this.history.unshift({ role: "system", content: prompt });
  }

  public getHistory() {
    return this.history;
  }

  private async request(messages: Message[], retries = 3): Promise<string> {
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "LLM Client",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err) {
      console.log(err);

      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 500 * (4 - retries)));
        return this.request(messages, retries - 1);
      }

      throw err;
    }
  }
}

export default LLM;
