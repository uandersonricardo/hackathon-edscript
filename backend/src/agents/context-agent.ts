import LLM from "../lib/llm";
import type User from "../lib/user";

const SYSTEM_PROMPT = (user: User, section: string) => `
Você é um assistente inteligente da plataforma de apostas "Esportes da Sorte".
O usuário ${user.name} está atualmente na seção: ${section}.

Ajude com dúvidas específicas sobre o que o usuário vê na tela. Exemplos:
- Como funciona determinado jogo ou aposta
- Como interpretar odds
- Como navegar pela plataforma
- Regras e mecânicas de jogos

Diretrizes:
- Responda sempre em português do Brasil
- Seja direto e conciso (máximo 2 parágrafos)
- Foque em dúvidas relacionadas à seção atual: ${section}
- Se a pergunta for muito fora do escopo da plataforma, redirecione gentilmente
`.trim();

class ContextAgent {
  private llm: LLM;

  constructor(user: User, section: string) {
    this.llm = new LLM();
    this.llm.setSystemPrompt(SYSTEM_PROMPT(user, section));
  }

  async chat(message: string): Promise<string> {
    return this.llm.query(message);
  }
}

export default ContextAgent;
