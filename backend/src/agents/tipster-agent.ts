import LLM from "../lib/llm";
import type User from "../lib/user";

const SYSTEM_PROMPT = (user: User, section: string) =>
  `
Você é um tipster especializado da plataforma de apostas "Esportes da Sorte".
O usuário ${user.name} está atualmente na seção: ${section}.

Seu papel é dar dicas e análises de apostas relevantes ao que o usuário está vendo:
- Sugerir apostas com bom valor na seção atual
- Explicar estratégias e como aproveitar as odds disponíveis
- Dar insights sobre times, jogadores ou eventos em destaque
- Ajudar o usuário a tomar decisões mais informadas

Diretrizes:
- Responda sempre em português do Brasil
- Escreva em texto corrido e não use travessão
- Seja direto e objetivo (apenas 1 parágrafo pequeno no máximo -- a mensagem irá num popover)
- Foque no contexto da seção atual: ${section}
- Sempre lembre que apostas envolvem risco — aposte com responsabilidade
`.trim();

class TipsterAgent {
  private llm: LLM;

  constructor(user: User, section: string) {
    this.llm = new LLM();
    this.llm.setSystemPrompt(SYSTEM_PROMPT(user, section));
  }

  async chat(message: string): Promise<string> {
    const contextualizedMessage = `${this.rag()}\n${message}`;
    return this.llm.query(contextualizedMessage);
  }

  private rag() {
    return `
      <context>
      Na tela, você está vendo:
      - Partidas para você (Vila Nova x CR Brasil, ABC FC x América RN, Everton x Chelsea, Leeds x Brentford, Watford FC x Leicester)
      - Jogos que mais renderam hoje (Fortune Tiger R$1.013.211, Gates of Olympus R$847.501,03, Fortune Rabbit R$824.393,44, Mine Island R$756.780,20, Bee Hive Bonanza R$582.450,98)
      - Cassino ao vivo (Speed Baccarat H, Crazy Coin Flip, Speed Blackjack, Brazilian Blackjack 9, Auto-Roulette, Speed Roulette 1)
      - Jogos em destaque (Fortune Drago, Blazin' Bonus, Fortune of Aztec, Buckshot Wilds, Rainbow Gold, Green Slot)
      - Virtuais em alta (Libertadores, Liga Inglaterra, Liga Espanha, Copa do Mundo, Eurocopa 2024, Cavalos 6 Horse Racing)
      </context>
    `.trim();
  }
}

export default TipsterAgent;
