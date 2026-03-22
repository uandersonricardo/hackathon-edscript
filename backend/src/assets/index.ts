import casinoCategories from "./json/casino/categories.json";
import casinoGames from "./json/casino/games.json";
import fixturesBaseball from "./json/fixtures/baseball.json";
import fixturesBasketball from "./json/fixtures/basketball.json";
import fixturesBoxing from "./json/fixtures/boxing.json";
import fixturesCounterStrike from "./json/fixtures/counter-strike.json";
import fixturesCurling from "./json/fixtures/curling.json";
import fixturesDarts from "./json/fixtures/darts.json";
import fixturesEFootball from "./json/fixtures/e-football.json";
import fixturesFloorball from "./json/fixtures/floorball.json";
import fixturesFutsal from "./json/fixtures/futsal.json";
import fixturesHandball from "./json/fixtures/handball.json";
import fixturesIceHockey from "./json/fixtures/ice-hockey.json";
import fixturesRugby from "./json/fixtures/rugby.json";
import fixturesSoccer from "./json/fixtures/soccer.json";
import fixturesTableTennis from "./json/fixtures/table-tennis.json";
import fixturesTennis from "./json/fixtures/tennis.json";
import fixturesVolleyball from "./json/fixtures/volleyball.json";
import fixturesWaterpolo from "./json/fixtures/waterpolo.json";
import gamesTags from "./json/games-tags.json";
import iframeGames from "./json/iframe/games.json";
import liveCasinoCategories from "./json/live-casino/categories.json";
import liveCasinoGames from "./json/live-casino/games.json";
import popularOdds from "./json/popular-odds.json";
import sports from "./json/sports.json";
import superOdds from "./json/super-odds.json";
import tags from "./json/tags.json";
import vendors from "./json/vendors.json";

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
