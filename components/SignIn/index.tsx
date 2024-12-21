"use client";
import { MiniKit } from "@worldcoin/minikit-js";

export const SignIn = () => {
  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    const res = await fetch(`/api/nonce`);
    const { nonce } = await res.json();

    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: nonce,
      requestId: "0", // Optional
      expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      statement:
        "This is my statement and here is a link https://worldcoin.com/apps",
    });
    console.log("holaa", MiniKit.walletAddress);
    if (finalPayload.status === "error") {
      return;
    } else {
      await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });
    }
  };

  return (
    <>
      <section className="flex gap-2">
        <button onClick={() => signInWithWallet()}>Sign in</button>
      </section>
    </>
  );
};
