"use client";

import { useState } from "react";
import SignIn from "./sign-in/page";
import GameContent from "./game/page";

export default function Home() {
  const [hasWalletAddress, setHasWalletAddress] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center   gap-y-3">
      {hasWalletAddress ? <GameContent /> : <SignIn />}
    </main>
  );
}
