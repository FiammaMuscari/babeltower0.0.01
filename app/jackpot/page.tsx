"use client";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-[url('/jackpot-tower.webp')] bg-cover bg-center bg-no-repeat text-white relative flex flex-col items-center justify-center">
      <section className="mt-[17vh] flex flex-col gap-[10em] items-center">
        <h2 className="text-6xl font-bold mb-2">Jackpot</h2>
        <div className="bg-[#442e0dad] backdrop-blur-sm rounded-xl p-6 flex flex-col items-center">
          <p className="text-5xl font-semibold">$154.581 WLD</p>
        </div>
      </section>

      <div className="flex flex-col justify-end items-center h-full mt-auto pb-10">
        <div className="flex space-x-10">
          <div className="relative">
            <Image
              src={"/button-blue.webp"}
              alt="Login Button"
              width={300}
              height={300}
            />
            <Link
              href="/game"
              className="absolute bottom-[33%] left-[50%] transform translate-x-[-50%] text-[25px] lilita-font cursor-pointer whitespace-nowrap"
            >
              Next time
            </Link>
          </div>
          {/* Segundo botón de Login */}
          <div className="relative">
            <Image
              src={"/button-blue.webp"}
              alt="Login Button"
              width={300}
              height={300}
            />
            <Link
              href="/game"
              className="absolute bottom-[33%] left-[50%] transform translate-x-[-50%] text-[30px] lilita-font cursor-pointer whitespace-nowrap"
            >
              Claim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
