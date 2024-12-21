"use client";

import { PixelArt } from "./PixelArt";
import { renderPixelArt } from "@/app/utils/pixelCharacters";
import { useGameLogic } from "@/app/hooks/useGameLogic";

const PixelBabelTowerIdle: React.FC = () => {
  const { gameState, upgradeCoinRate, upgradeGrowthRate, useGemBoost } =
    useGameLogic();

  const towerColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 pixel-art">
        Pixel Babel Tower Idle
      </h1>
      <div className="flex gap-4 mb-4">
        <div className="text-xl">Coins: {Math.floor(gameState.coins)}</div>
        <div className="text-xl">Gems: {gameState.gems}</div>
      </div>
      <div className="relative w-64 h-96 bg-gray-700 border-4 border-gray-600 mb-4">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-linear overflow-hidden"
          style={{
            height: `${Math.min((gameState.towerHeight / 1000) * 100, 100)}%`,
          }}
        >
          {Array.from({ length: Math.ceil(gameState.towerHeight) }).map(
            (_, index) => (
              <div
                key={index}
                className={`h-1 ${towerColors[index % towerColors.length]}`}
              />
            )
          )}
        </div>
        {gameState.characters.map((character, index) => (
          <div
            key={character.name}
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              left: `${(index + 1) * 25 - 15}%`,
              bottom: `${
                (Math.sin(gameState.towerHeight / 10 + index) + 1) * 20
              }%`,
            }}
          >
            <PixelArt sprite={renderPixelArt(character.sprite)} scale={2} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded pixel-art"
          onClick={upgradeCoinRate}
        >
          Upgrade Coin Rate (Cost:{" "}
          {Math.floor(10 * Math.pow(1.1, gameState.coinRate))})
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded pixel-art"
          onClick={upgradeGrowthRate}
        >
          Upgrade Growth Rate (Cost:{" "}
          {Math.floor(15 * Math.pow(1.15, gameState.growthRate))})
        </button>
      </div>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4 pixel-art"
        onClick={useGemBoost}
        disabled={gameState.gems === 0}
      >
        Use Gem Boost
      </button>
      <div className="text-sm text-gray-400">
        <div>Coin Rate: {gameState.coinRate.toFixed(1)} per second</div>
        <div>
          Growth Rate: {gameState.growthRate.toFixed(1)} pixels per second
        </div>
        <div>Tower Height: {Math.floor(gameState.towerHeight)} pixels</div>
      </div>
    </div>
  );
};

export default PixelBabelTowerIdle;
