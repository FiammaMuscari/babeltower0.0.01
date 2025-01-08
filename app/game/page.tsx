"use client";

import { Floor } from "@/components/floor";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { useEffect, useRef, useState } from "react";
import { GameProvider, useGame } from "../Context/GameContext";
import { ethers } from "ethers";
import WLD_ABI from "../../public/ABI/WLD.json";
import { MiniKit } from "@worldcoin/minikit-js";

function GameContent() {
  const { floors, unlockFloor } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState<string>("");
  const WLD_CONTRACT_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
  // RPC from wordchain
  const RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public";

  const getBalance = async () => {
    if (!MiniKit.walletAddress) {
      throw new Error(
        "need a wallet bro, you need to connect your wallet first"
      );
    }
    try {
      // 1. provider
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      // 2. contract object
      const contract = new ethers.Contract(
        WLD_CONTRACT_ADDRESS,
        WLD_ABI,
        provider
      );
      const userAddress = MiniKit.walletAddress;
      // 3. balance
      const balanceWei = await contract.balanceOf(userAddress);

      // 4. Wei to WLD
      const balanceWLD = ethers.formatUnits(balanceWei, 18);

      setBalance(balanceWLD);
      console.log("Balance WLD:", balanceWLD);
    } catch (error) {
      console.error("Error al obtener balance:", error);
    }
  };
  useEffect(() => {
    getBalance();
  }, []);

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
