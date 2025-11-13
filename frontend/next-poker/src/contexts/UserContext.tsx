"use client";

import { createContext, useState, useContext, useEffect } from "react"
import { User, UserContextType, GetCurrentUser } from "@/api/auth";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchCurrentUser = async () => {
    try {
      // Indian Pokerゲーム側ではUserContextは使用しないため、
      // SNS側のユーザー情報取得は行わない
      // 必要に応じてゲーム側のsnsUserを使用する
      console.log("UserContext: Indian PokerゲームではfetchCurrentUserをスキップします");
    } catch (error) {
      console.error("ログインしているユーザーの取得に失敗しました:", error);
      setUser(null);
    }
  }

  // Indian PokerではuseEffectでの自動取得をスキップ
  // useEffect(() => {
  //   fetchCurrentUser();
  // }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext);
}