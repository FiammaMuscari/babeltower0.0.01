import React, { createContext, useContext, useState, useEffect } from "react";

const GAME_CONFIG = {
  BASE_WORKER_COST: 5,
  BASE_EXPANSION_COST: 25,
  BASE_GEM_GENERATION: 1,
  BASE_WORKER_PRODUCTION: 2,
  FLOOR_PRODUCTION_MULTIPLIER: 1.5,
  WORKER_PRODUCTION_MULTIPLIER: 1.3,
  WORKER_COST_MULTIPLIER: 1.2,
  WORKER_COUNT_COST_MULTIPLIER: 1.8,
  EXPANSION_COST_MULTIPLIER: 1.5,
  MAX_WORKERS_PER_FLOOR: 100,
  INITIAL_GEMS: 50,
};

interface GameContextType {
  totalGems: number;
  accumulatedGems: number;
  collectGems: () => void;
  floors: FloorState[];
  setTotalGems: React.Dispatch<React.SetStateAction<number>>;
  setAccumulatedGems: React.Dispatch<React.SetStateAction<number>>;
  addWorker: (level: number) => void;
  unlockFloor: (level: number) => void;
}

interface FloorState {
  level: number;
  isLocked: boolean;
  workers: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [totalGems, setTotalGems] = useState(GAME_CONFIG.INITIAL_GEMS);
  const [accumulatedGems, setAccumulatedGems] = useState(0);
  const [floors, setFloors] = useState<FloorState[]>([
    { level: 1, isLocked: false, workers: 0 },
    { level: 2, isLocked: true, workers: 0 },
  ]);

  const gemGenerationRate = GAME_CONFIG.BASE_GEM_GENERATION;

  useEffect(() => {
    const interval = setInterval(() => {
      setAccumulatedGems(
        (prevAccumulated) => prevAccumulated + gemGenerationRate
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [gemGenerationRate]);

  const collectGems = () => {
    setTotalGems((prev) => prev + accumulatedGems);
    setAccumulatedGems(0);
  };

  const calculateFloorGemGeneration = (floor: FloorState) => {
    if (floor.isLocked) return 0;

    const baseGeneration =
      GAME_CONFIG.BASE_GEM_GENERATION *
      Math.pow(GAME_CONFIG.FLOOR_PRODUCTION_MULTIPLIER, floor.level - 1);

    const workerGeneration =
      floor.workers *
      (GAME_CONFIG.BASE_WORKER_PRODUCTION *
        Math.pow(GAME_CONFIG.WORKER_PRODUCTION_MULTIPLIER, floor.level - 1));

    return baseGeneration + workerGeneration;
  };
  const calculateWorkerCost = (level: number, currentWorkers: number) =>
    Math.floor(
      GAME_CONFIG.BASE_WORKER_COST *
        Math.pow(GAME_CONFIG.WORKER_COUNT_COST_MULTIPLIER, currentWorkers) *
        Math.pow(GAME_CONFIG.WORKER_COST_MULTIPLIER, level - 1)
    );

  const calculateExpansionCost = (level: number) =>
    Math.floor(
      GAME_CONFIG.BASE_EXPANSION_COST *
        Math.pow(GAME_CONFIG.EXPANSION_COST_MULTIPLIER, level - 1)
    );

  useEffect(() => {
    const interval = setInterval(() => {
      const gemsGenerated = floors.reduce(
        (acc, floor) => acc + calculateFloorGemGeneration(floor),
        0
      );
      setAccumulatedGems((prev) => prev + gemsGenerated);
    }, 1000);
    return () => clearInterval(interval);
  }, [floors]);

  const addWorker = (level: number) => {
    const floor = floors.find((f) => f.level === level);
    if (!floor || floor.workers >= GAME_CONFIG.MAX_WORKERS_PER_FLOOR) return;
    const cost = calculateWorkerCost(level, floor.workers);
    if (totalGems < cost) return;
    setFloors((currentFloors) =>
      currentFloors.map((floor) =>
        floor.level === level ? { ...floor, workers: floor.workers + 1 } : floor
      )
    );
    setTotalGems((prev) => prev - cost);
  };

  const unlockFloor = (levelToUnlock: number) => {
    const cost = calculateExpansionCost(levelToUnlock);
    if (totalGems < cost) return;
    setFloors((currentFloors) => {
      const updatedFloors = currentFloors.map((floor) =>
        floor.level === levelToUnlock ? { ...floor, isLocked: false } : floor
      );
      const highestLevel = Math.max(...currentFloors.map((f) => f.level));
      if (levelToUnlock === highestLevel) {
        return [
          ...updatedFloors,
          { level: highestLevel + 1, isLocked: true, workers: 0 },
        ];
      }
      return updatedFloors;
    });
    setTotalGems((prev) => prev - cost);
  };

  return (
    <GameContext.Provider
      value={{
        totalGems,
        accumulatedGems,
        collectGems,
        floors,
        setTotalGems,
        setAccumulatedGems,
        addWorker,
        unlockFloor,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
