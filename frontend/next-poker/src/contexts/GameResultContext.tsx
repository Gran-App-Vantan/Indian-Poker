"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { ResultResponse } from "@/api/game/result";

interface GameResultContextType {
  result: ResultResponse | null;
  setResult: (result: ResultResponse | null) => void;
  clearResult: () => void;
}

const GameResultContext = createContext<GameResultContextType | undefined>(undefined);

export function GameResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ResultResponse | null>(null);

  const clearResult = () => {
    setResult(null);
  };

  return (
    <GameResultContext.Provider value={{ result, setResult, clearResult }}>
      {children}
    </GameResultContext.Provider>
  );
}

export function useGameResult() {
  const context = useContext(GameResultContext);
  if (!context) {
    throw new Error("useGameResult must be used within GameResultProvider");
  }
  return context;
}