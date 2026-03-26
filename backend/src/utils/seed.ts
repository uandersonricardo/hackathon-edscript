import Auth from "../lib/auth";
import Embedding from "../lib/embedding";
import History from "../lib/history";
import User from "../lib/user";

const recurrentPlan = {
  name: "Plano Bônus",
  amount: 20.0,
  startDate: new Date(2026, 3, 22),
  bonus: 5,
  cardBrand: "visa",
  cardLastDigits: "1633",
  cardExpirationDate: "04/34",
  cardName: "EDSON ESPORTES DA SORTE",
};

const embedding = new Embedding({
  casino: 0.2,
  casinoCategories: [0.3, 0.4, 0.3],
  liveCasino: 0.3,
  liveCasinoCategories: [0.5, 0.1, 0.1, 0.2, 0.1],
  virtuals: 0.1,
  virtualCategories: [0.1, 0.6, 0.3],
  fixtures: 0.4,
  fixtureLeagues: [0.1, 0.4, 0.3, 0.2],
});

const history = new History();
history.push({
  date: new Date(2026, 3, 19),
  type: "deposit",
  value: 35,
});

const achievements = {
  rank: "diamond",
  experience: 100,
  missions: [],
  rewards: [],
};

const user = new User({
  id: "501d8152-8beb-4429-bfe5-38cdbf774a14",
  username: "edson",
  password: "edson",
  email: "edson@esportesdasorte.com.br",
  imageUrl: "https://i.pravatar.cc/150?img=8",
  name: "Edson Esporte da Sorte",
  taxDocument: "12345678900",
  address: "Av. Conselheiro Aguiar, 256 - Boa Viagem - Recife - PE",
  birthDate: new Date(1990, 1, 1),
  balance: 231.47,
  maxBetAmount: 50.0,
  recurrentPlan,
  embedding,
  history,
  achievements,
});

export const runSeed = () => {
  Auth.register(user);
};
