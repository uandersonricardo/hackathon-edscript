import casinoCategories from "./assets/json/casino/categories.json";
import casinoGames from "./assets/json/casino/games.json";
import fixturesBaseball from "./assets/json/fixtures/baseball.json";
import fixturesBasketball from "./assets/json/fixtures/basketball.json";
import fixturesBoxing from "./assets/json/fixtures/boxing.json";
import fixturesCounterStrike from "./assets/json/fixtures/counter-strike.json";
import fixturesCurling from "./assets/json/fixtures/curling.json";
import fixturesDarts from "./assets/json/fixtures/darts.json";
import fixturesEFootball from "./assets/json/fixtures/e-football.json";
import fixturesFloorball from "./assets/json/fixtures/floorball.json";
import fixturesFutsal from "./assets/json/fixtures/futsal.json";
import fixturesHandball from "./assets/json/fixtures/handball.json";
import fixturesIceHockey from "./assets/json/fixtures/ice-hockey.json";
import fixturesRugby from "./assets/json/fixtures/rugby.json";
import fixturesSoccer from "./assets/json/fixtures/soccer.json";
import fixturesTableTennis from "./assets/json/fixtures/table-tennis.json";
import fixturesTennis from "./assets/json/fixtures/tennis.json";
import fixturesVolleyball from "./assets/json/fixtures/volleyball.json";
import fixturesWaterpolo from "./assets/json/fixtures/waterpolo.json";
import gamesTags from "./assets/json/games-tags.json";
import iframeGames from "./assets/json/iframe/games.json";
import liveCasinoCategories from "./assets/json/live-casino/categories.json";
import liveCasinoGames from "./assets/json/live-casino/games.json";
import popularOdds from "./assets/json/popular-odds.json";
import sports from "./assets/json/sports.json";
import superOdds from "./assets/json/super-odds.json";
import tags from "./assets/json/tags.json";
import vendors from "./assets/json/vendors.json";

export const fixtures: Record<string, unknown> = {
  baseball: fixturesBaseball,
  basketball: fixturesBasketball,
  boxing: fixturesBoxing,
  "counter-strike": fixturesCounterStrike,
  curling: fixturesCurling,
  darts: fixturesDarts,
  "e-football": fixturesEFootball,
  floorball: fixturesFloorball,
  futsal: fixturesFutsal,
  handball: fixturesHandball,
  "ice-hockey": fixturesIceHockey,
  rugby: fixturesRugby,
  soccer: fixturesSoccer,
  "table-tennis": fixturesTableTennis,
  tennis: fixturesTennis,
  volleyball: fixturesVolleyball,
  waterpolo: fixturesWaterpolo,
};

export {
  casinoCategories,
  casinoGames,
  gamesTags,
  iframeGames,
  liveCasinoCategories,
  liveCasinoGames,
  popularOdds,
  sports,
  superOdds,
  tags,
  vendors,
};
