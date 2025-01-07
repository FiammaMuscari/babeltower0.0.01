/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useGame } from "@/app/Context/GameContext";

// Game Balance Configuration - Must match GameContext
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
};

interface FloorProps {
  level: number;
  isLocked: boolean;
  onUnlock: () => void;
}

export function Floor({ level, isLocked, onUnlock }: FloorProps) {
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [showGemsNeeded, setShowGemsNeeded] = useState(false);
  const { addWorker, floors, totalGems } = useGame();

  const floor = floors.find((f) => f.level === level);
  const workers = floor ? floor.workers : 0;

  // Calculate gem generation for this floor
  const calculateGemsPerSecond = () => {
    if (isLocked) return 0;
    const baseGeneration = Math.floor(
      GAME_CONFIG.BASE_GEM_GENERATION *
        Math.pow(GAME_CONFIG.FLOOR_PRODUCTION_MULTIPLIER, level - 1)
    );

    const workerGeneration = Math.floor(
      workers *
        (GAME_CONFIG.BASE_WORKER_PRODUCTION *
          Math.pow(GAME_CONFIG.WORKER_PRODUCTION_MULTIPLIER, level - 1))
    );

    return baseGeneration + workerGeneration;
  };

  // Calculate costs
  const workerCost = Math.floor(
    GAME_CONFIG.BASE_WORKER_COST *
      Math.pow(GAME_CONFIG.WORKER_COUNT_COST_MULTIPLIER, workers) *
      Math.pow(GAME_CONFIG.WORKER_COST_MULTIPLIER, level - 1)
  );

  const expansionCost = Math.floor(
    GAME_CONFIG.BASE_EXPANSION_COST *
      Math.pow(GAME_CONFIG.EXPANSION_COST_MULTIPLIER, level - 1)
  );

  const gemsNeeded = isLocked
    ? expansionCost - totalGems
    : workerCost - totalGems;

  const handleAddWorker = () => {
    if (!isLocked && floor) {
      if (workerCost <= totalGems) {
        addWorker(level);
        setIsGifVisible(true);
        setShowGemsNeeded(false);
      } else {
        setShowGemsNeeded(true);
        setTimeout(() => setShowGemsNeeded(false), 2000);
      }
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "k";
    } else {
      return value.toString();
    }
  };

  return (
    <div className="flex max-w-[10em] h-[108px] w-[10em] relative">
      {isGifVisible && (
        <div className="absolute left-[-70px] top-2 z-10">
          <img
            src="/building-worker.gif"
            alt="Building Worker"
            className="h-full w-[6em]"
          />
        </div>
      )}

      <div className={`w-full relative ${isLocked ? "filter blur-sm" : ""}`}>
        <div
          className="h-[100px] w-full border-[6px] rounded-md border-black"
          style={{
            backgroundImage: `url(${
              level % 2 === 0 ? "/block-1.webp" : "/block-2.webp"
            })`,
            backgroundSize: "120% 110%", // Ajusta la imagen a la caja completamente
            backgroundPosition: "center", // Centra la imagen
            backgroundRepeat: "no-repeat", // Evita repetir la imagen
          }}
        />
        <section className="absolute top-1 right-1/3">
          {!isLocked && (
            <div className="absolute left-[-80px] top-2 flex flex-col gap-1">
              <span className="text-sm text-white bg-black/50 px-2 py-1 rounded">
                +{formatNumber(calculateGemsPerSecond())}/s
              </span>
            </div>
          )}
        </section>
        {!isLocked && (
          <div className="absolute left-[-80px] top-1">
            <section className="text-xs flex items-center text-white bg-black/50  rounded m-auto px-1 py-1">
              More {formatNumber(workerCost)}
              <Image
                src={"/gem.webp"}
                alt="logo"
                width={50}
                height={50}
                className=" w-8 h-8 "
              />
            </section>
          </div>
        )}
      </div>

      {isLocked && (
        <section>
          <button
            onClick={() => totalGems >= expansionCost && onUnlock()}
            className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white font-bold"
          >
            <Image
              src="/button-purple.webp"
              alt="Expand Button"
              className="flex m-auto"
              width={120}
              height={120}
            />
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-[10%] text-sm text-white">
              Expand
            </div>
          </button>
          <div className="flex items-center justify-center absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-[10%] text-sm  text-white">
            {formatNumber(expansionCost)}
            <Image
              src={"/gem.webp"}
              alt="logo"
              width={50}
              height={50}
              className=" w-8 h-8 "
            />
          </div>
        </section>
      )}

      {!isLocked && (
        <section className="absolute right-[-60px] top-[60px] transform -translate-y-1/2 flex flex-col">
          <button
            onClick={handleAddWorker}
            disabled={
              workers >= GAME_CONFIG.MAX_WORKERS_PER_FLOOR || gemsNeeded > 0
            }
            className={`bg-transparent border-none ${
              workers >= GAME_CONFIG.MAX_WORKERS_PER_FLOOR || gemsNeeded > 0
                ? "opacity-50"
                : ""
            }`}
          >
            <Image
              src="/button-green.webp"
              alt="Add Worker Button"
              className="flex m-auto"
              width={60}
              height={60}
            />
            <div className="absolute top-[26%] left-1/2 transform -translate-x-1/2 font-bold -translate-y-[50%] text-sm text-white">
              +
            </div>
          </button>

          {gemsNeeded > 0 && (
            <span className="absolute top-[10px] right-[-35px] text-center text-sm text-red-500 mt-1 font-bold">
              {formatNumber(Math.floor(gemsNeeded))}
            </span>
          )}

          <button className="bg-transparent border-none mt-[-10px]">
            <Image
              src="/button-orange.webp"
              alt="Experience Button"
              className="flex m-auto w-[60px] h-[60px]"
              width={50}
              height={50}
            />
            <div className="absolute top-[70%] font-bold left-1/2 transform -translate-x-1/2 -translate-y-[50%] text-sm text-white">
              Exp
            </div>
          </button>
        </section>
      )}
    </div>
  );
}
