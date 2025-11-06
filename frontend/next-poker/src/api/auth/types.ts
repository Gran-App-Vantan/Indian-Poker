export interface User {
  id: number;
  userId: number;
  snsId: number;
  point: number;
  name: string;
  userIcon: string;
  isParent: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
}