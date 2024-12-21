"use client";
import { useState, useEffect, useCallback } from "react";
import { pixelCharacters } from "../utils/pixelCharacters";

interface GameState {
  coins: number;
  gems: number;
  towerHeight: number;
  coinRate: number;
  growthRate: number;
  characters: typeof pixelCharacters;
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    gems: 0,
    towerHeight: 0,
    coinRate: 1,
    growthRate: 1,
    characters: pixelCharacters,
  });

  const addCoins = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const upgradeCoinRate = useCallback(() => {
    setGameState((prev) => {
      const cost = Math.floor(10 * Math.pow(1.1, prev.coinRate));
      if (prev.coins >= cost) {
        return {
          ...prev,
          coins: prev.coins - cost,
          coinRate: prev.coinRate + 1,
        };
      }
      return prev;
    });
  }, []);

  const upgradeGrowthRate = useCallback(() => {
    setGameState((prev) => {
      const cost = Math.floor(15 * Math.pow(1.15, prev.growthRate));
      if (prev.coins >= cost) {
        return {
          ...prev,
          coins: prev.coins - cost,
          growthRate: prev.growthRate + 1,
        };
      }
      return prev;
    });
  }, []);

  const useGemBoost = useCallback(() => {
    setGameState((prev) => {
      if (prev.gems > 0) {
        return {
          ...prev,
          gems: prev.gems - 1,
          coins: prev.coins + prev.coinRate * 100,
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        coins: prev.coins + prev.coinRate,
        towerHeight: prev.towerHeight + prev.growthRate / 10,
        gems: prev.gems + (Math.random() < 0.01 ? 1 : 0), // 1% chance to get a gem every second
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    gameState,
    addCoins,
    addGems,
    upgradeCoinRate,
    upgradeGrowthRate,
    useGemBoost,
  };
}
