import LLM from "../lib/llm";
import type User from "../lib/user";

export type OnboardingOption = { label: string; value: string };

export type OnboardingResponse = {
  content: string;
  options: OnboardingOption[] | null;
  multiSelect: boolean;
  done: boolean;
};

type Step = "experience" | "support" | "bet_types" | "done";
type HistoryEntry = { from: "agent" | "user"; content: string };

const EXPERIENCE_OPTIONS: OnboardingOption[] = [
  { label: "Iniciante", value: "iniciante" },
  { label: "Intermediário", value: "intermediario" },
  { label: "Experiente", value: "experiente" },
];

const SUPPORT_OPTIONS: OnboardingOption[] = [
  { label: "Sim", value: "sim" },
  { label: "Não", value: "nao" },
];

const BET_TYPE_OPTIONS: OnboardingOption[] = [
  { label: "Esportes", value: "esportes" },
  { label: "Cassino", value: "cassino" },
  { label: "Virtuais", value: "virtuais" },
];

const STEP_OPTIONS: Record<Step, OnboardingOption[] | null> = {
  experience: EXPERIENCE_OPTIONS,
  support: SUPPORT_OPTIONS,
  bet_types: BET_TYPE_OPTIONS,
  done: null,
};

const STEP_MULTI_SELECT: Record<Step, boolean> = {
  experience: false,
  support: false,
  bet_types: true,
  done: false,
};

class OnboardingAgent {
  private llm: LLM;
  private step: Step = "experience";
  private history: HistoryEntry[] = [];

  public experienceLevel?: string;
  public needsSupport?: boolean;
  public betTypes?: string[];

  constructor(private user: User) {
    this.llm = new LLM();
    this.llm.setSystemPrompt(
      `Você é um assistente de onboarding da plataforma de apostas "Esportes da Sorte". Está guiando ${user.name} pelo processo de boas-vindas. Responda sempre em português do Brasil, de forma amigável e concisa (máximo 2 frases).`,
    );
  }

  getHistory(): HistoryEntry[] {
    if (this.history.length === 0) {
      this.history.push({ from: "agent", content: "Qual o seu nível de experiência com apostas?" });
    }
    return this.history;
  }

  getCurrentOptions(): { options: OnboardingOption[] | null; multiSelect: boolean; done: boolean } {
    return {
      options: STEP_OPTIONS[this.step],
      multiSelect: STEP_MULTI_SELECT[this.step],
      done: this.step === "done",
    };
  }

  async chat(message: string): Promise<OnboardingResponse> {
    this.history.push({ from: "user", content: message });

    if (this.step === "experience") {
      const lower = message.toLowerCase();
      const matched = EXPERIENCE_OPTIONS.find((o) => lower.includes(o.value) || lower.includes(o.label.toLowerCase()));
      if (matched) {
        this.experienceLevel = matched.value;
        this.step = "support";
        const content = "Você precisa de apoio para fazer sua primeira aposta?";
        this.history.push({ from: "agent", content });
        return { content, options: SUPPORT_OPTIONS, multiSelect: false, done: false };
      }
    }

    if (this.step === "support") {
      const lower = message.toLowerCase().trim();
      if (lower === "sim" || lower === "s") {
        this.needsSupport = true;
      } else if (lower === "não" || lower === "nao" || lower === "n") {
        this.needsSupport = false;
      }

      if (this.needsSupport !== undefined) {
        this.step = "bet_types";
        const content = "Selecione os tipos de apostas que você conhece:";
        this.history.push({ from: "agent", content });
        return { content, options: BET_TYPE_OPTIONS, multiSelect: true, done: false };
      }
    }

    if (this.step === "bet_types") {
      const lower = message.toLowerCase();
      this.betTypes = BET_TYPE_OPTIONS.filter(
        (o) => lower.includes(o.label.toLowerCase()) || lower.includes(o.value),
      ).map((o) => o.value);

      this.step = "done";
      const content = `Perfeito, ${this.user.name.split(" ")[0]}! Seu perfil foi criado. Boas apostas! 🎉`;
      this.history.push({ from: "agent", content });
      return { content, options: null, multiSelect: false, done: true };
    }

    if (this.step === "done") {
      return { content: "", options: null, multiSelect: false, done: true };
    }

    // Fallback: free-form LLM response, stay on current step
    const response = await this.llm.query(message);
    this.history.push({ from: "agent", content: response });
    return {
      content: response,
      options: STEP_OPTIONS[this.step],
      multiSelect: STEP_MULTI_SELECT[this.step],
      done: false,
    };
  }
}

export default OnboardingAgent;
