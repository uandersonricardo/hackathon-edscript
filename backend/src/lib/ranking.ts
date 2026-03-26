import type User from "./user";

class Ranking {
  private static mapUserToAmount: Record<string, { user: User; amount: number }> = {};

  public static push(user: User, amount: number) {
    Ranking.mapUserToAmount[user.id] = { user, amount };
  }

  public static top10() {
    const entries = Object.values(Ranking.mapUserToAmount);
    return entries.sort((a, b) => b.amount - a.amount).slice(0, 10);
  }
}

export default Ranking;
