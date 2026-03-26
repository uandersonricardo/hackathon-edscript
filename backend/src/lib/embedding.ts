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

  public getHomepage() {
    return {
      casino: [],
      liveCasino: [],
      virtuals: [],
      fixtures: [],
    };
  }
}

export default Embedding;
