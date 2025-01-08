"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const route = useRouter();

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
    console.log("MiniKit.walletAddress: ", MiniKit.walletAddress);
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
    if (MiniKit.walletAddress !== null) {
      route.push("/game");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[url('/loading-tower.webp')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col">
        <span className="opacity-90 absolute text-[50px] top-[10vh] left-[4vh] transform font-bold bounce">
          Babel
        </span>
        <span className="opacity-80 absolute text-[50px] top-[16vh] right-[2vh] transform text-3xl font-bold bounce-delay">
          Tower
        </span>
        <div className="flex flex-col justify-end mb-[15vh] items-center h-full mt-auto pb-10">
          <div className="relative" onClick={() => signInWithWallet()}>
            <Image
              src={"/button-purple.webp"}
              alt="logo"
              width={300}
              height={300}
            />
            <Link
              href="/game"
              className="absolute bottom-[33%] left-[50%] transform translate-x-[-50%] text-[50px] lilita-font cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
