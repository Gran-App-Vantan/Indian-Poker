import { Card } from "../game/types";

export interface User {
  deviceNumber: number;
  id: number;
  name: string;
  latch: number;
  snsId: number;
  isSet: number; // 0と1で判断
  isPlaying: number; // 0と1で判断
  point: number;
  card: Card;
  createdAt: string;
  updatedAt: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
}