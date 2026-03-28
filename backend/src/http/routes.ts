import { Router, type Request, type Response, type NextFunction } from "express";

import {
  casinoCategories,
  casinoGames,
  fixtures,
  gamesTags,
  iframeGames,
  liveCasinoCategories,
  liveCasinoGames,
  popularOdds,
  sports,
  superOdds,
  tags,
  vendors,
} from "../assets";
import Auth from "../lib/auth";
import User from "../lib/user";
import { authenticateUser } from "./middlewares";
import Ranking from "../lib/ranking";
import SupportAgent from "../agents/support-agent";
import OnboardingAgent from "../agents/onboarding-agent";
import TipsterAgent from "../agents/tipster-agent";

const router = Router();

const vendorMap = new Map<number, string>(
  ((vendors as any).data.vendors as { id: number; name: string }[]).map((v) => [v.id, v.name]),
);

function sortGames(games: any[]): any[] {
  return [...games].sort((a, b) => {
    const aOrder = a.orderBy ?? Infinity;
    const bOrder = b.orderBy ?? Infinity;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (b.popular !== a.popular) return b.popular ? 1 : -1;
    if (b.newGame !== a.newGame) return b.newGame ? 1 : -1;
    return 0;
  });
}

router.get("/sports", (_req, res) => res.json(sports));
router.get("/vendors", (_req, res) => res.json(vendors));
router.get("/tags", (_req, res) => res.json(tags));
router.get("/games-tags", (_req, res) => res.json(gamesTags));
router.get("/popular-odds", (_req, res) => res.json(popularOdds));
router.get("/super-odds", (_req, res) => res.json(superOdds));
router.get("/casino/categories", (_req, res) => res.json(casinoCategories));
router.get("/casino/games", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

  const allGames = (casinoGames as any).data.games as any[];
  const filtered = sortGames(categoryId != null ? allGames.filter((g) => g.categoryId === categoryId) : allGames);
  const total = filtered.length;
  const games = filtered
    .slice((page - 1) * limit, page * limit)
    .map((g: any) => ({ ...g, vendorName: vendorMap.get(g.vendorId) ?? null }));

  res.json({ success: true, data: { games, total, page, limit } });
});

router.get("/live-casino/categories", (_req, res) => res.json(liveCasinoCategories));

router.get("/live-casino/games", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

  const allGames = (liveCasinoGames as any).data.games as any[];
  const filtered = sortGames(categoryId != null ? allGames.filter((g) => g.categoryId === categoryId) : allGames);
  const total = filtered.length;
  const games = filtered
    .slice((page - 1) * limit, page * limit)
    .map((g: any) => ({ ...g, vendorName: vendorMap.get(g.vendorId) ?? null }));

  res.json({ success: true, data: { games, total, page, limit } });
});
router.get("/iframe/games", (_req, res) => res.json(iframeGames));

router.get("/virtuals/categories", (_req, res) => {
  const provider = (iframeGames as any).data[0];
  const allGames = provider.games as any[];
  const categories = (provider.categories as { id: number; name: string }[]).map((cat) => {
    const count = allGames.filter((g) => String(g.categoryId) === String(cat.id)).length;
    return { ...cat, count, mobileCount: count, webCount: count, order: cat.id };
  });
  res.json({ success: true, data: { categories } });
});

router.get("/virtuals/games", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const categoryId = req.query.categoryId ? String(req.query.categoryId) : undefined;

  const provider = (iframeGames as any).data[0];
  const allGames = provider.games as any[];
  const filtered = categoryId != null ? allGames.filter((g) => String(g.categoryId) === categoryId) : allGames;
  const sorted = [...filtered].sort((a, b) => Number(a.order) - Number(b.order));
  const total = sorted.length;
  const games = sorted.slice((page - 1) * limit, page * limit);

  res.json({ success: true, data: { games, total, page, limit } });
});

router.get("/fixtures", (_req, res) => {
  res.json({ success: true, data: Object.keys(fixtures) });
});

router.get("/fixtures/:sport", (req: Request, res: Response, _next: NextFunction) => {
  const sport = req.params.sport as string;
  const data = fixtures[sport];

  if (!data) {
    res.status(404).json({ success: false, message: "Sport not found" });
    return;
  }

  res.json(data);
});

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const user = Auth.login(username, password);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(401).json({ success: false, message: "The credentials provided are incorrect" });
  }
});

router.post("/auth/register", (req, res) => {
  const attributes = req.body;

  try {
    const user = new User(attributes);
    Auth.register(user);

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(401).json({ success: false, message: "The credentials provided are incorrect" });
  }
});

router.get("/users/:id", (req, res) => {
  const user = Auth.findUser(req.params.id);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.json({ success: true, data: user });
});

router.post("/bet", authenticateUser, (req, res) => {
  const userId = (req as any).userId;
  const user = Auth.findUser(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const { amount, type } = req.body;

  if (amount > user.maxBetAmount) {
    res.status(400).json({ success: false, message: "Max bet amount exceeded" });
    return;
  }

  user.balance -= amount;
  user.history.push({
    date: new Date(),
    type: type,
    value: amount,
  });

  res.json({ success: true, data: null });
});

router.get("/history", authenticateUser, (req, res) => {
  const userId = (req as any).userId;
  const user = Auth.findUser(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const history = user.history.entries;

  res.json({ success: true, data: history });
});

router.get("/achievements", authenticateUser, (req, res) => {
  const userId = (req as any).userId;
  const user = Auth.findUser(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const achievements = user.achievements;

  res.json({ success: true, data: achievements });
});

router.get("/homepage", authenticateUser, (req, res) => {
  const userId = (req as any).userId;
  const user = Auth.findUser(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const priority = user.embedding.getHomepage();

  const casinoCatList = (casinoCategories as any).data.categories as { id: number; name: string }[];
  const liveCasinoCatList = (liveCasinoCategories as any).data.categories as { id: number; name: string }[];

  const MOCKED_POSSIBLE_GAMES = [34476, 34475, 30499, 26405, 26421, 19328, 23214, 30830];
  const allCasinoGames = (casinoGames as any).data.games as any[];
  const prefCasinoCatId = casinoCatList[priority.preferredCasinoCategory]?.id;
  const sortedCasinoGames = (
    prefCasinoCatId
      ? [
          ...allCasinoGames.filter((g) => g.categoryId === prefCasinoCatId),
          ...allCasinoGames.filter((g) => g.categoryId !== prefCasinoCatId),
        ]
      : allCasinoGames
  ).filter((g) => MOCKED_POSSIBLE_GAMES.includes(g.id));

  const MOCKED_POSSIBLE_LIVE_GAMES = [18452, 19918, 30464, 33104, 9357, 18225];
  const allLiveCasinoGames = (liveCasinoGames as any).data.games as any[];
  const prefLiveCasinoCatId = liveCasinoCatList[priority.preferredLiveCasinoCategory]?.id;
  const sortedLiveCasinoGames = (
    prefLiveCasinoCatId
      ? [
          ...allLiveCasinoGames.filter((g) => g.categoryId === prefLiveCasinoCatId),
          ...allLiveCasinoGames.filter((g) => g.categoryId !== prefLiveCasinoCatId),
        ]
      : allLiveCasinoGames
  ).filter((g) => MOCKED_POSSIBLE_LIVE_GAMES.includes(g.id));

  const provider = (iframeGames as any).data[0];
  const allVirtualGames = provider.games as any[];
  const virtualCatList = provider.categories as { id: number | string; name: string }[];
  const prefVirtualCatId = virtualCatList[priority.preferredVirtualCategory]?.id;
  const sortedVirtualGames = (
    prefVirtualCatId
      ? [
          ...allVirtualGames.filter((g) => String(g.categoryId) === String(prefVirtualCatId)),
          ...allVirtualGames.filter((g) => String(g.categoryId) !== String(prefVirtualCatId)),
        ]
      : allVirtualGames
  ).sort((a, b) => a.order - b.order);

  const GAME_LIMIT = 6;
  const FIXTURE_LIMIT = 5;
  const MOCK_FIXTURES = [71707178, 72260562, 70865136, 72275180, 72260570, 72165427, 72165424, 72477242];

  function extractFixtures(sportKey: string, limit: number) {
    const sportData = fixtures[sportKey] as any;
    if (!sportData) return [];
    const entries: any[] = [];
    const PRIMARY_MARKETS = ["Resultado", "Resultado Final", "Vencedor (incl.prolo)", "Vencedor", "1x2"];
    for (const sport of sportData.data ?? []) {
      for (const country of sport.cs ?? []) {
        for (const season of country.sns ?? []) {
          for (const f of season.fs ?? []) {
            const resultBtg = f.btgs?.find((b: any) => PRIMARY_MARKETS.includes(b.btgN));
            if (!resultBtg) continue;
            const fos = resultBtg.fos ?? [];
            if (fos.length < 2) continue;
            const homeOdd = fos[0]?.hO;
            const drawOdd = fos.length >= 3 ? fos[1]?.hO : null;
            const awayOdd = fos.length >= 3 ? fos[2]?.hO : fos[1]?.hO;
            if (!homeOdd || !awayOdd || !MOCK_FIXTURES.includes(f.fId)) continue;
            entries.push({
              id: f.fId,
              leagueName: season.lName,
              homeTeam: { name: (f.hcN ?? "").trim(), externalId: f.hcBId },
              awayTeam: { name: (f.acN ?? "").trim(), externalId: f.acBId },
              odds: { home: homeOdd, draw: drawOdd, away: awayOdd },
              startDate: f.fsd,
              isLive: !!f.lSt,
              totalOdds: f.oCnt ?? Math.floor(Math.random() * 1000),
            });
            if (entries.length >= limit) return entries;
          }
        }
      }
    }
    return entries;
  }

  const allFixtures: any[] = [];
  for (const sport of priority.preferredSports) {
    if (allFixtures.length >= FIXTURE_LIMIT) break;
    allFixtures.push(...extractFixtures(sport, FIXTURE_LIMIT - allFixtures.length));
  }

  const SECTION_TITLES: Record<string, string> = {
    casino: "Jogos em destaque",
    liveCasino: "Cassino ao vivo",
    virtuals: "Virtuais em alta",
    fixtures: "Partidas para você",
  };

  const TOP_WIN_AMOUNTS = [1013211.31, 847501.03, 824393.44, 756780.2, 582450.98];
  const TOP_GAMES_IDS = [19533, 13485, 22910, 26194, 24214];
  const topGames = allCasinoGames
    .filter((g: any) => TOP_GAMES_IDS.includes(g.id))
    .map((g: any) => ({
      id: g.id,
      name: g.name,
      vendorName: vendorMap.get(g.vendorId) ?? null,
      winAmount: TOP_WIN_AMOUNTS[TOP_GAMES_IDS.indexOf(g.id)],
    }))
    .sort((a, b) => TOP_GAMES_IDS.indexOf(a.id) - TOP_GAMES_IDS.indexOf(b.id));

  const sections = priority.sectionOrder.map((type) => {
    if (type === "casino") {
      return {
        type,
        title: SECTION_TITLES.casino,
        games: sortedCasinoGames.slice(0, GAME_LIMIT).map((g: any) => ({
          id: g.id,
          name: g.name,
          vendorName: vendorMap.get(g.vendorId) ?? null,
          popular: !!g.popular,
          newGame: !!g.newGame,
        })),
      };
    }

    if (type === "liveCasino") {
      return {
        type,
        title: SECTION_TITLES.liveCasino,
        games: sortedLiveCasinoGames.slice(0, GAME_LIMIT).map((g: any) => ({
          id: g.id,
          name: g.name,
          vendorName: vendorMap.get(g.vendorId) ?? null,
          popular: !!g.popular,
          newGame: !!g.newGame,
        })),
      };
    }

    if (type === "virtuals") {
      return {
        type,
        title: SECTION_TITLES.virtuals,
        games: sortedVirtualGames.slice(0, GAME_LIMIT).map((g: any) => ({
          id: g.iframeProviderGameId ?? String(g.id),
          name: g.name,
          vendorName: null,
          popular: false,
          newGame: false,
        })),
      };
    }

    if (type === "fixtures") {
      return { type, title: SECTION_TITLES.fixtures, matches: allFixtures };
    }

    return null;
  });

  res.json({ success: true, data: { sections, topGames } });
});

router.get("/ranking", (_req, res) => {
  const ranking = Ranking.top10;

  res.json({ success: true, data: ranking });
});

// ── Notifications ─────────────────────────────────────────────────────────────

type NormalNotification = {
  id: string;
  type: "normal";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

type BetSuggestion = {
  match: string;
  selection: string;
  odd: number;
  amount: number;
};

type AgenticNotification = {
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

type Notification = NormalNotification | AgenticNotification;

const D = (daysAgo: number, hoursAgo = 0) => new Date(Date.now() - daysAgo * 864e5 - hoursAgo * 36e5).toISOString();

const MOCK_NOTIFICATIONS: Notification[] = [
  // ── Hoje ──────────────────────────────────────────────────────────────────
  {
    id: "n1",
    type: "agentic",
    agent: "tipster",
    title: "Dica quente: Flamengo x Palmeiras",
    body: "Analisei os últimos 10 confrontos e as estatísticas apontam alta chance de gols dos dois lados. Aqui está minha sugestão para você:",
    createdAt: D(0, 0.3),
    read: false,
    bet: { match: "Flamengo x Palmeiras", selection: "Ambas marcam – Sim", odd: 1.85, amount: 50 },
  },
  {
    id: "n2",
    type: "agentic",
    agent: "support",
    title: "Precisa de ajuda com o depósito?",
    body: "Notei que você iniciou um depósito mas ele não foi concluído. Se tiver algum problema com o pagamento, posso te ajudar agora mesmo.",
    createdAt: D(0, 1),
    read: false,
    supportAction: { label: "Ir para depósito", target: "deposit" },
  },
  {
    id: "n3",
    type: "normal",
    title: "Seu depósito foi confirmado",
    body: "R$ 200,00 foram adicionados à sua conta com sucesso.",
    createdAt: D(0, 3),
    read: true,
  },
  // ── Ontem ─────────────────────────────────────────────────────────────────
  {
    id: "n4",
    type: "agentic",
    agent: "onboarding",
    title: "Bem-vindo à plataforma!",
    body: "Sabia que você pode usar o cashout para garantir seus ganhos antes do fim da partida? Vá em Histórico e acompanhe suas apostas em tempo real.",
    createdAt: D(1, 2),
    read: false,
  },
  {
    id: "n5",
    type: "normal",
    title: "Sua missão foi concluída!",
    body: "Parabéns! Você completou a missão 'Primeira aposta do dia' e ganhou 50 pontos de experiência.",
    createdAt: D(1, 5),
    read: true,
  },
  // ── Na última semana ──────────────────────────────────────────────────────
  {
    id: "n6",
    type: "agentic",
    agent: "tipster",
    title: "Super odd: Real Madrid na Champions",
    body: "Real Madrid está em grande fase e enfrenta um adversário enfraquecido. Odd excelente para aproveitar agora:",
    createdAt: D(3, 1),
    read: true,
    bet: { match: "Real Madrid x Bayern", selection: "Real Madrid – Vitória", odd: 2.1, amount: 30 },
  },
  {
    id: "n7",
    type: "agentic",
    agent: "onboarding",
    title: "Explore o Cassino ao Vivo",
    body: "Você ainda não experimentou o Cassino ao Vivo! Temos dealers reais 24h por dia com blackjack, roleta e muito mais. Toque em Início e selecione 'Cassino ao vivo'.",
    createdAt: D(5, 0),
    read: true,
  },
  // ── Mais antigas ──────────────────────────────────────────────────────────
  {
    id: "n8",
    type: "agentic",
    agent: "support",
    title: "Como está sendo sua experiência?",
    body: "Percebi que você teve dificuldade para encontrar as regras de um jogo. Posso explicar como funciona qualquer jogo do catálogo — é só me pedir!",
    createdAt: D(10, 0),
    read: true,
  },
  {
    id: "n9",
    type: "normal",
    title: "Bônus de boas-vindas ativado",
    body: "Seu bônus de R$ 50,00 foi creditado. Ele estará disponível após sua primeira aposta.",
    createdAt: D(14, 0),
    read: true,
  },
];

router.get("/notifications", authenticateUser, (_req, res) => {
  res.json({ success: true, data: MOCK_NOTIFICATIONS });
});

// TODO: Send Support Messages (Chat)
// TODO: Get Match Stats

// ── Support Chat ──────────────────────────────────────────────────────────────

const supportSessions = new Map<string, SupportAgent>();

function getOrCreateSession(user: User): SupportAgent {
  if (!supportSessions.has(user.id)) {
    supportSessions.set(user.id, new SupportAgent(user));
  }
  return supportSessions.get(user.id)!;
}

router.get("/support/chat", authenticateUser, (_req, res) => {
  const user = Auth.findUser((_req as any).userId)!;
  const session = getOrCreateSession(user);
  const history = session.getHistory().map((m, i) => ({
    id: String(i),
    from: m.role === "user" ? "user" : "agent",
    content: m.content,
  }));
  res.json({ success: true, data: history });
});

router.post("/support/chat", authenticateUser, async (req, res) => {
  const user = Auth.findUser((req as any).userId)!;
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }

  const session = getOrCreateSession(user);
  const response = await session.chat(message.trim());
  res.json({ success: true, data: { response } });
});

router.delete("/support/chat", authenticateUser, (req, res) => {
  const user = Auth.findUser((req as any).userId)!;
  const session = getOrCreateSession(user);
  session.reset(user);
  res.json({ success: true, data: null });
});

// ── Tipster Agent Chat ─────────────────────────────────────────────────────────

const tipsterSessions = new Map<string, TipsterAgent>();

router.post("/tipster/chat", authenticateUser, async (req, res) => {
  const user = Auth.findUser((req as any).userId)!;
  const { message, section, sessionId } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }

  const key = `${user.id}:${sessionId ?? "default"}`;
  if (!tipsterSessions.has(key)) {
    tipsterSessions.set(key, new TipsterAgent(user, section ?? "plataforma"));
  }

  const session = tipsterSessions.get(key)!;
  const response = await session.chat(message.trim());
  res.json({ success: true, data: { response } });
});

// ── Onboarding Chat ───────────────────────────────────────────────────────────

const onboardingSessions = new Map<string, OnboardingAgent>();

function getOrCreateOnboardingSession(user: User): OnboardingAgent {
  if (!onboardingSessions.has(user.id)) {
    onboardingSessions.set(user.id, new OnboardingAgent(user));
  }
  return onboardingSessions.get(user.id)!;
}

router.get("/onboarding/chat", authenticateUser, (req, res) => {
  const user = Auth.findUser((req as any).userId)!;
  const session = getOrCreateOnboardingSession(user);
  const history = session.getHistory().map((m, i) => ({
    id: String(i),
    from: m.from,
    content: m.content,
  }));
  const { options, multiSelect, done } = session.getCurrentOptions();
  res.json({ success: true, data: { history, options, multiSelect, done } });
});

router.post("/onboarding/chat", authenticateUser, async (req, res) => {
  const user = Auth.findUser((req as any).userId)!;
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ success: false, message: "Message is required" });
    return;
  }

  const session = getOrCreateOnboardingSession(user);
  const response = await session.chat(message.trim());
  res.json({ success: true, data: response });
});

export default router;

