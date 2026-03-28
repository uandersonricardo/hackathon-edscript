type EmbeddingAttributes = {
  casino: number;
  casinoCategories: number[];
  liveCasino: number;
  liveCasinoCategories: number[];
  virtuals: number;
  virtualCategories: number[];
  fixtures: number;
  fixtureLeagues: number[];
};

class Embedding {
  public casino: number;
  public casinoCategories: number[];
  public liveCasino: number;
  public liveCasinoCategories: number[];
  public virtuals: number;
  public virtualCategories: number[];
  public fixtures: number;
  public fixtureLeagues: number[];

  constructor(attributes: EmbeddingAttributes) {
    this.casino = attributes.casino;
    this.casinoCategories = attributes.casinoCategories;
    this.liveCasino = attributes.liveCasino;
    this.liveCasinoCategories = attributes.liveCasinoCategories;
    this.virtuals = attributes.virtuals;
    this.virtualCategories = attributes.virtualCategories;
    this.fixtures = attributes.fixtures;
    this.fixtureLeagues = attributes.fixtureLeagues;
  }

  public getHomepage(): {
    sectionOrder: ("casino" | "liveCasino" | "virtuals" | "fixtures")[];
    preferredCasinoCategory: number;
    preferredLiveCasinoCategory: number;
    preferredVirtualCategory: number;
    preferredSports: string[];
  } {
    const sections = [
      { type: "casino" as const, weight: this.casino },
      { type: "liveCasino" as const, weight: this.liveCasino },
      { type: "virtuals" as const, weight: this.virtuals },
      { type: "fixtures" as const, weight: this.fixtures },
    ];

    const sectionOrder = [...sections].sort((a, b) => b.weight - a.weight).map((s) => s.type);

    const preferredCasinoCategory = this.casinoCategories.indexOf(Math.max(...this.casinoCategories));
    const preferredLiveCasinoCategory = this.liveCasinoCategories.indexOf(Math.max(...this.liveCasinoCategories));
    const preferredVirtualCategory = this.virtualCategories.indexOf(Math.max(...this.virtualCategories));

    const sportKeys = ["soccer"];
    const preferredSports = this.fixtureLeagues
      .map((weight, i) => ({ sport: sportKeys[i] ?? "soccer", weight }))
      .sort((a, b) => b.weight - a.weight)
      .map((s) => s.sport);

    return {
      sectionOrder,
      preferredCasinoCategory,
      preferredLiveCasinoCategory,
      preferredVirtualCategory,
      preferredSports,
    };
  }
}

export default Embedding;
