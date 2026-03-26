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

router.get("/sports", (_req, res) => res.json(sports));
router.get("/vendors", (_req, res) => res.json(vendors));
router.get("/tags", (_req, res) => res.json(tags));
router.get("/games-tags", (_req, res) => res.json(gamesTags));
router.get("/popular-odds", (_req, res) => res.json(popularOdds));
router.get("/super-odds", (_req, res) => res.json(superOdds));
router.get("/casino/categories", (_req, res) => res.json(casinoCategories));
router.get("/casino/games", (_req, res) => res.json(casinoGames));
router.get("/live-casino/categories", (_req, res) => res.json(liveCasinoCategories));
router.get("/live-casino/games", (_req, res) => res.json(liveCasinoGames));
router.get("/iframe/games", (_req, res) => res.json(iframeGames));

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
