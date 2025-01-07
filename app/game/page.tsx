"use client";

import { Floor } from "@/components/floor";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { useRef } from "react";
import { GameProvider, useGame } from "../Context/GameContext";

function GameContent() {
  const { floors, unlockFloor } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen w-full bg-[url('/home-tower.webp')] bg-cover bg-center bg-no-repeat text-white bg-fixed">
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>{" "}
      {/* Capa con sombra */}
      <div className="relative z-10">
        <Header />
        <div className="flex flex-col items-center justify-center px-4 pt-28 h-[calc(100vh-80px)]">
          <div
            className="flex flex-col-reverse pt-12 pb-4 gap-2 overflow-y-auto h-full w-full items-center scrollbar-hidden"
            ref={containerRef}
          >
            {floors.map((floor) => (
              <Floor
                key={floor.level}
                level={floor.level}
                isLocked={floor.isLocked}
                onUnlock={() => unlockFloor(floor.level)}
              />
            ))}
          </div>
        </div>
        <Navigation />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
