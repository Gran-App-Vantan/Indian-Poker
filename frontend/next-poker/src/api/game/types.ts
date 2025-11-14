export interface Card {
  id: number;
  number: number;
  type: "heart" | "diamond" | "spade" | "club" | "jokerRed" | "jokerBlack";
  imagePath: string;
}

export interface Player {
  id: number;
  card: "heart" | "diamond" | "spade" | "club" | "jokerRed" | "jokerBlack";
  latch: number;
  point: number;
  isSet: number; // 0と1で判断
};