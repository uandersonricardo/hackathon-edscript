# Esportes da Sorte — Hackathon EDScript 2026

Projeto desenvolvido para o **Hackathon EDScript 2026**, Desafio 01: **Mobile & UX**.

## Sobre o Desafio

> **Desafio 01 — Recriação Mobile Nativa**
> Reconstruir jornadas essenciais do site da Esportes da Sorte em uma experiência mobile nativa de alta performance e acessibilidade.

---

## Equipe MUNix

| Nome | Papel |
|---|---|
| Marina Paixão | Designer |
| Natalie Chaves | Designer |
| Uanderson Silva | Desenvolvedor |
| Maria Eduarda Paixão | Negócios |

---

## O que foi desenvolvido

### Sistema Multiagente
Três agentes de IA cobrindo o ciclo de vida completo do usuário:

| Agente | Função |
|---|---|
| **Onboarding** | Integração e ativação de novos usuários |
| **Tipster** | Recomendações de apostas personalizadas em tempo real |
| **Suporte** | Atendimento conversacional inteligente |

### Nova UI/UX
- **Acessibilidade**: modo claro, alto contraste, redução de animações, texto maior — pensado para o público mais velho
- **Simplicidade**: fluxos mais claros, menos cliques, ícones maiores
- **Retenção e exploração**: vídeo do jogo, estatísticas, Copa do Mundo, limitação de valor de aposta, homepage personalizada por análise do perfil do cliente

### Gamificação
- Mini-jogo integrado
- Roleta da Sorte
- Ranking semanal de jogadores
- Fluxo de gamificação mais claro com níveis (Bronze → Prata → Ouro → Platina → Ametista)

### Aumento de Receita
- Depósito recorrente via **PIX automático**

---

## Stack

| Camada | Tecnologia |
|---|---|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express |
| LLMs | OpenRouter — GLM 4.5 Air / GPT-4o Mini / Gemini 3.0 Flash |
| Deploy | Render |

**Backend:** https://backend-edscript-munix.onrender.com

---

## Estrutura do Repositório

```
.
├── mobile/       # Aplicativo React Native
├── backend/      # API Express + agentes LLM
└── api-docs/     # Documentação das APIs
```

---

## Como rodar localmente

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Backend
```bash
cd backend
npm install
npm run dev
```
