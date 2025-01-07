"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import SignIn from "./sign-in/page";
import GameContent from "./game/page";

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
    <main className="flex min-h-screen flex-col items-center justify-center   gap-y-3">
      {hasWalletAddress ? <GameContent /> : <SignIn />}
    </main>
  );
}
