import type Embedding from "./embedding";
import type History from "./history";

export type RecurrentPlan = {
  name: string;
  amount: number;
  startDate: Date;
  bonus: number;
  cardBrand: string;
  cardLastDigits: string;
  cardExpirationDate: string;
  cardName: string;
};

export type Achievements = {
  rank: string;
  experience: number;
  missions: string[];
  rewards: string[];
};

export type UserAttributes = {
  id: string;
  username: string;
  password: string;
  email: string;
  imageUrl: string;
  name: string;
  taxDocument: string;
  address: string;
  birthDate: Date;
  balance: number;
  maxBetAmount: number;
  recurrentPlan: RecurrentPlan | null;
  embedding: Embedding;
  history: History;
  achievements: Achievements;
};

class User {
  public id: string;
  public username: string;
  public password: string;
  public email: string;
  public imageUrl: string;
  public name: string;
  public taxDocument: string;
  public address: string;
  public birthDate: Date;
  public balance: number;
  public maxBetAmount: number;
  public recurrentPlan: RecurrentPlan | null;
  public embedding: Embedding;
  public history: History;
  public achievements: Achievements;

  constructor(attributes: UserAttributes) {
    this.id = attributes.id;
    this.username = attributes.username;
    this.password = attributes.password;
    this.email = attributes.email;
    this.imageUrl = attributes.imageUrl;
    this.name = attributes.name;
    this.taxDocument = attributes.taxDocument;
    this.address = attributes.address;
    this.birthDate = attributes.birthDate;
    this.balance = attributes.balance;
    this.maxBetAmount = attributes.maxBetAmount;
    this.recurrentPlan = attributes.recurrentPlan;
    this.embedding = attributes.embedding;
    this.history = attributes.history;
    this.achievements = attributes.achievements;
  }
}

export default User;
