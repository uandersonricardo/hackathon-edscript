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

  const homepage = user.embedding.getHomepage();

  res.json({ success: true, data: homepage });
});

router.get("/ranking", (_req, res) => {
  const ranking = Ranking.top10;

  res.json({ success: true, data: ranking });
});

// TODO: Send Support Messages (Chat)
// TODO: Get Match Stats

export default router;
