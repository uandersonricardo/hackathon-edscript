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

## Funcionalidades

### Sistema Multiagente
Três agentes de IA cobrindo o ciclo de vida completo do usuário, com LLMs reais via OpenRouter e backend próprio:

| Agente | Função |
|---|---|
| **Onboarding** | Conduz o novo usuário pelo cadastro, explica funcionalidades e personaliza a experiência inicial com base nas preferências coletadas |
| **Tipster** | Analisa as partidas disponíveis e sugere apostas personalizadas contextualmente à tela que o usuário está navegando |
| **Suporte** | Atendimento conversacional com histórico persistido, responde dúvidas, resolve problemas e encaminha ações dentro do app |

Cada agente mantém **sessão e histórico de conversa** no backend, garantindo contexto entre interações.

### Nova UI/UX
- **Acessibilidade**: modo claro, alto contraste, redução de animações, texto maior — pensado para o público mais velho
- **Simplicidade**: fluxos mais claros, menos cliques, ícones maiores, navegação hierárquica mais direta
- **Retenção e exploração**: prévia em vídeo dos jogos, estatísticas de partidas, seção Copa do Mundo, homepage personalizada com base no perfil do cliente
- **Responsabilidade**: limites de aposta e depósito configuráveis (diário, semanal, mensal), exclusão temporária e auto-exclusão permanente de conta

### Homepage Personalizada
A página inicial é gerada dinamicamente com base no perfil do usuário. Um banco de dados RAG simulado armazena embeddings de perfis e jogos, e ao fazer login o sistema recupera as categorias e jogos mais relevantes para aquele usuário, reordenando a homepage sem intervenção manual.

### Gamificação
- **Roleta da Sorte**: roleta animada com prêmios, acessível pela homepage
- **Mini-jogo**: jogo integrado para engajamento entre apostas
- **Ranking semanal**: placar dos maiores ganhos da semana com avatares e níveis
- **Sistema de níveis**: progressão clara — Bronze → Prata → Ouro → Platina → Ametista — com badge visível no perfil

### Aumento de Receita
- Depósito recorrente via **PIX automático** com valor e frequência configuráveis pelo usuário

---

## Arquitetura

```
┌─────────────────────┐        ┌─────────────────────────────┐
│   React Native App  │ ──────▶│        Express Backend      │
│   (Expo)            │        │                             │
│                     │        │  ┌──────────────────────┐   │
│  - UI/UX            │        │  │   Agente Onboarding  │   │
│  - Contexts         │        │  │   Agente Tipster     │   │
│  - React Query      │        │  │   Agente Suporte     │   │
│  - Expo Router      │        │  └──────────┬───────────┘   │
└─────────────────────┘        │             │               │
                               │  ┌──────────▼───────────┐   │
                               │  │   OpenRouter (LLMs)  │   │
                               │  │  GLM / GPT / Gemini  │   │
                               │  └──────────────────────┘   │
                               │                             │
                               │  ┌──────────────────────┐   │
                               │  │  RAG Database (mock) │   │
                               │  │  Embeddings de perfil│   │
                               │  └──────────────────────┘   │
                               └─────────────────────────────┘
```

### Fluxo dos Agentes

```
Usuário abre o app
      │
      ▼
Agente Onboarding ──▶ coleta preferências ──▶ personaliza homepage via RAG
      │
      ▼
Navega pelo app ──▶ Agente Tipster (contextual por tela)
      │
      ▼
Tem dúvida/problema ──▶ Agente Suporte (histórico persistido)
```

---

## Dados

Os dados utilizados são **mockados a partir de fontes reais**, com freeze no dia **21/03/2025**:

| Fonte | Dados |
|---|---|
| **Sporting Tech** | Catálogo de jogos, slots, provedores e metadados de produtos |
| **BetsAPI** | Partidas ao vivo, fixtures, odds e estatísticas de esportes |
| **RAG Database (mock)** | Embeddings de perfis de usuários e histórico de preferências para personalização da homepage |

O backend e os agentes LLM são **reais e funcionais** — apenas os dados de origem são mockados/congelados para garantir consistência durante a apresentação.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express |
| LLMs | OpenRouter — GLM 4.5 Air / GPT-5 Mini / Gemini 3.0 Flash |
| Personalização | RAG com embeddings mockados |
| Deploy | Render |

**Backend:** https://backend-edscript-munix.onrender.com

---

## Instalação do APK (Android)

> O app está disponível como APK para instalação direta em dispositivos Android.

**Download:** https://drive.google.com/file/d/1b98HUeGNcDx8rga9yVZy9duTpi_YwGrH/view?usp=sharing

### Passo a passo

1. **Baixe o APK** pelo link acima
2. **Habilite o modo desenvolvedor** no Android:
   - Vá em _Configurações → Sobre o telefone_
   - Toque 7 vezes em _Número da versão_ até ativar o modo desenvolvedor
   - Em _Configurações → Opções do desenvolvedor_, ative _Fontes desconhecidas_ (ou _Instalar apps desconhecidos_)
3. **Desative proteções do Google Play Protect** se necessário:
   - Abra o _Google Play Store → Menu → Play Protect_
   - Desative temporariamente a verificação de apps
4. **Execute o APK** baixado e siga as instruções de instalação

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
