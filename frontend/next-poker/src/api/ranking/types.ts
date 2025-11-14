import { Card } from "../game";

export interface Rank {
  rankPosition: number;
  id: number;
  card: Card;
  latch: number;
  point: number;
}