type HistoryEntryType = "casino" | "liveCasino" | "virtual" | "fixture" | "deposit" | "withdrawal";

type HistoryEntry = {
  date: Date;
  type: HistoryEntryType;
  value: any;
};

class History {
  public entries: HistoryEntry[];

  constructor() {
    this.entries = [];
  }

  public push(entry: HistoryEntry) {
    this.entries.push(entry);
  }

  public getCasinoEntries() {
    this.entries.filter((entry) => entry.type === "casino");
  }

  public getLiveCasinoEntries() {
    this.entries.filter((entry) => entry.type === "liveCasino");
  }

  public getVirtualEntries() {
    this.entries.filter((entry) => entry.type === "virtual");
  }

  public getFixtureEntries() {
    this.entries.filter((entry) => entry.type === "fixture");
  }

  public getDepositEntries() {
    this.entries.filter((entry) => entry.type === "deposit");
  }

  public getWithdrawalEntries() {
    this.entries.filter((entry) => entry.type === "withdrawal");
  }
}

export default History;
