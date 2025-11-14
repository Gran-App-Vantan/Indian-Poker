export interface Card {
  id: number;
  number: number;
  type: "heart" | "diamond" | "spade" | "club" | "jokerRed" | "jokerBlack";
  imagePath: string;
}