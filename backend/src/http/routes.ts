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

// TODO: Login & Register & Profile
// TODO: Register Bet
// TODO: Send Support Messages (Chat)
// TODO: Get History
// TODO: Get Achievements
// TODO: Get User
// TODO: Get Homepage
// TODO: Get Match Stats
// TODO: Get Ranking

export default router;
