"use client";
import PixelBabelTowerIdle from "@/components/PixelBabelTowerIdle";
import { SignIn } from "@/components/SignIn";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasWalletAddress, setHasWalletAddress] = useState(false);

  useEffect(() => {
    const checkWalletAddress = async () => {
      if (MiniKit.walletAddress) {
        setHasWalletAddress(true);
      }
    };
    checkWalletAddress();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      {hasWalletAddress ? <PixelBabelTowerIdle /> : <SignIn />}
    </main>
  );
}
