"use client";

import { createContext, useState, useContext, useEffect } from "react"
import { User, UserContextType, GetCurrentUser } from "@/api/auth";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await GetCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("ログインしているユーザーの取得に失敗しました:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext);
}